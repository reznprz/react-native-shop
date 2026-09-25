# Dockerized Web Deploy (UAT + Prod)

This supersedes the manual flow in `DEPLOY_README.md` / `docs/react-native-web-deployment.md`
for the **web** build. The Expo web export is still a static SPA, but it is now built and
served inside a Docker container (multi-stage `Dockerfile` → `nginx:alpine`), and deployed by
GitHub Actions (`.github/workflows/deploy-uat.yml`, `.github/workflows/deploy-prod.yml`) using
the same SSH-over-Cloudflare-Tunnel pattern as Khanapana's `deploy-uat.yml` / `deploy-prod.yml`.

## Why Docker here

- Reproducible builds: the Node version and build steps are pinned in the `Dockerfile`
  instead of depending on whatever is installed on the VM.
- Image-based rollback: `docker compose down` / re-`up` on a previous checkout is a clean
  revert path, no leftover files in a shared directory.
- Consistent with the rest of the org's CI/CD (Khanapana already deploys this way).

Nginx is still required — it now runs **inside** the container to serve the static bundle
(`docker/nginx.conf`, SPA fallback + immutable caching for `_expo/static` and `assets`). The
container is only published to a **loopback** port (`127.0.0.1:8091` UAT, `127.0.0.1:8092`
prod), not to the public port 80 directly. The VM's existing host Nginx (the one Cloudflare
Tunnel already forwards to) reverse-proxies the public hostname to that loopback port. This
keeps host Nginx as the single stable ingress point for the VM across all services, and means
deploys never fight over who owns port 80.

## One-time VM setup

Per VM (UAT and Prod are separate VMs/checkouts):

1. Install Docker Engine + Compose plugin, and `git`.
2. Clone the repo to the directory that will be used as `*_COMPOSE_DIR`:
   - UAT default: `/opt/react-native-shop`
   - Prod default: `/opt/react-native-shop-prod`
3. Point host Nginx at the container instead of serving files directly. Replace the
   `root`/`try_files` block from `DEPLOY_README.md` with a reverse proxy, e.g. for UAT:

   ```nginx
   server {
       listen 80;
       server_name ui.shk-uat-chipie.uk;

       location / {
           proxy_pass http://127.0.0.1:8091;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   For prod, use the prod UI hostname (TBD — not provisioned yet) and `proxy_pass
   http://127.0.0.1:8092;`.

4. Leave the Cloudflare Tunnel ingress mapping as-is (`hostname → http://localhost:80`) —
   it still points at host Nginx, which now proxies into the container.
5. Test: `sudo nginx -t && sudo systemctl reload nginx`.

Prod-specific: the prod VM, its Nginx site, and its Cloudflare Tunnel ingress entry do not
exist yet and need to be created following the same pattern as UAT before
`deploy-prod.yml` can succeed.

## Required GitHub secrets

| Secret | Purpose |
|---|---|
| `UAT_VM_HOST`, `UAT_VM_USER`, `UAT_VM_PORT`, `UAT_VM_SSH_KEY` | SSH (via `cloudflared access ssh`) into the UAT VM |
| `UAT_COMPOSE_DIR` | Path to the repo checkout on the UAT VM (defaults to `/opt/react-native-shop`) |
| `PROD_VM_HOST`, `PROD_VM_USER`, `PROD_VM_PORT`, `PROD_VM_SSH_KEY` | SSH into the Prod VM |
| `PROD_COMPOSE_DIR` | Path to the repo checkout on the Prod VM (defaults to `/opt/react-native-shop-prod`) |
| `UAT_EXPO_PUBLIC_API_BASE_URL`, `UAT_EXPO_PUBLIC_TOKEN_BASE_URL` | Already used by other workflows; reused to build `.env.uat` at deploy time |
| `PROD_EXPO_PUBLIC_API_BASE_URL`, `PROD_EXPO_PUBLIC_TOKEN_BASE_URL` | Already used by other workflows; reused to build `.env.prod` at deploy time |

Prod deploys additionally require a PR merged to `master` carrying the `ci:deploy:prod`
label (same gate Khanapana uses), or `workflow_dispatch` with `force_deploy: true`.

## Deploy flow (both workflows)

1. SSH to the VM through `cloudflared access ssh`.
2. `git fetch && git checkout <branch> && git pull` in `*_COMPOSE_DIR`.
3. Write `.env.uat` / `.env.prod` on the VM from GitHub secrets (baked into the image at
   build time, since `EXPO_PUBLIC_*` vars are inlined at export time).
4. `docker compose -f docker-compose.<env>.yml down --remove-orphans`
5. `docker compose -f docker-compose.<env>.yml build --no-cache`
6. `docker compose -f docker-compose.<env>.yml up -d`
7. Health check: `docker compose ps`, `docker exec <container> wget --spider http://localhost/`,
   and a curl against the loopback port.
8. Logs + `docker image prune -f` (always, even on failure, for visibility/cleanup).

## Local testing

```bash
cp .env.uat .env.uat   # or hand-edit values
docker compose -f docker-compose.uat.yml build
docker compose -f docker-compose.uat.yml up -d
curl -I http://127.0.0.1:8091
```
