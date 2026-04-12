# React Native Web Deployment Guide

This guide documents how to build and deploy the Expo web app for **React Native Shop** on the Ubuntu VM using **Nginx** and **Cloudflare Tunnel**.

## Overview

- **Project path:** `/opt/react-native-shop`
- **Expo web build output:** `/opt/react-native-shop/dist`
- **Nginx web root:** `/var/www/react-native-shop`
- **Public URL:** `https://ui.shk-uat-chipie.uk`
- **Nginx site config:** `/etc/nginx/sites-available/react-native-shop`
- **Cloudflare Tunnel config:** `/etc/cloudflared/config.yml`

---

## 1. Prerequisites

Make sure the VM has:

- Node.js installed
- npm installed
- Nginx installed and running
- `cloudflared` installed and running
- The domain `ui.shk-uat-chipie.uk` mapped to the correct Cloudflare Tunnel

Optional but useful:

- Git
- PM2 or systemd for other services

---

## 2. Build the Expo web app

Go to the project:

```bash
cd /opt/react-native-shop
```

Install dependencies if needed:

```bash
npm install
```

Build the app:

```bash
npx expo export --platform web --clear
```

This generates the production web build in:

```bash
/opt/react-native-shop/dist
```

Verify build output:

```bash
ls -la /opt/react-native-shop/dist
```

Expected files:

- `index.html`
- `_expo/`
- `assets/`
- `metadata.json`

---

## 3. Deploy build files to Nginx

Create the Nginx web root if it does not exist:

```bash
sudo mkdir -p /var/www/react-native-shop
```

Clear old files:

```bash
sudo rm -rf /var/www/react-native-shop/*
```

Copy the latest build:

```bash
sudo cp -r /opt/react-native-shop/dist/* /var/www/react-native-shop/
```

Fix ownership:

```bash
sudo chown -R www-data:www-data /var/www/react-native-shop
```

Verify deployed files:

```bash
ls -la /var/www/react-native-shop
```

---

## 4. Nginx configuration

Create or verify this file:

```bash
sudo nano /etc/nginx/sites-available/react-native-shop
```

Use this config:

```nginx
server {
    listen 80;
    server_name ui.shk-uat-chipie.uk;

    root /var/www/react-native-shop;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

Enable the site:

```bash
sudo ln -sfn /etc/nginx/sites-available/react-native-shop /etc/nginx/sites-enabled/react-native-shop
```

Validate Nginx:

```bash
sudo nginx -t
```

Reload Nginx:

```bash
sudo systemctl reload nginx
```

Test locally on the VM:

```bash
curl -I http://localhost
```

Expected response:

```text
HTTP/1.1 200 OK
```

---

## 5. Cloudflare Tunnel configuration

Edit the tunnel config:

```bash
sudo nano /etc/cloudflared/config.yml
```

Make sure it includes this hostname mapping:

```yaml
ingress:
  - hostname: ui.shk-uat-chipie.uk
    service: http://localhost:80
  - service: http_status:404
```

If you already have other services, keep them and add the UI entry before the fallback.

Example:

```yaml
tunnel: 1edf3ed6-48cd-4441-be8f-1d77f2021cc6
credentials-file: /etc/cloudflared/1edf3ed6-48cd-4441-be8f-1d77f2021cc6.json

 ingress:
  - hostname: uat-laxmithai.shk-uat-chipie.uk
    service: http://localhost:3000

  - hostname: uat-backendapi.shk-uat-chipie.uk
    service: http://localhost:8088

  - hostname: ssh-uat.shk-uat-chipie.uk
    service: ssh://localhost:22

  - hostname: brick-ui.shk-uat-chipie.uk
    service: http://localhost:9000

  - hostname: brick-api.shk-uat-chipie.uk
    service: http://localhost:8083

  - hostname: api-service.shk-uat-chipie.uk
    service: http://localhost:8082

  - hostname: token-service.shk-uat-chipie.uk
    service: http://localhost:8080

  - hostname: ui.shk-uat-chipie.uk
    service: http://localhost:80

  - service: http_status:404
```

Restart cloudflared:

```bash
sudo systemctl restart cloudflared
sudo systemctl status cloudflared
```

---

## 6. Cloudflare DNS check

In Cloudflare DNS, make sure the `ui` hostname points to the **correct tunnel**.

During troubleshooting, we found that `ui.shk-uat-chipie.uk` already existed as a Tunnel record but pointed to the wrong tunnel target. That must be corrected in the Cloudflare DNS dashboard.

What to check:

- Open Cloudflare dashboard
- Open zone: `shk-uat-chipie.uk`
- Go to **DNS** → **Records**
- Search for `ui`
- Confirm the **Tunnel** record points to the tunnel used by this VM

If the record points to the wrong tunnel, either:

- edit it to the correct tunnel, or
- delete it and recreate it with:

```bash
cloudflared tunnel route dns 1edf3ed6-48cd-4441-be8f-1d77f2021cc6 ui.shk-uat-chipie.uk
```

If you get an error saying a record already exists, fix or delete the existing DNS record first in Cloudflare.

---

## 7. One-command deploy script

Save this script as:

```bash
/opt/react-native-shop/deploy.sh
```

Contents:

```bash
#!/bin/bash
set -e

PROJECT_DIR="/opt/react-native-shop"
BUILD_DIR="$PROJECT_DIR/dist"
NGINX_DIR="/var/www/react-native-shop"
NGINX_SITE="/etc/nginx/sites-available/react-native-shop"
NGINX_LINK="/etc/nginx/sites-enabled/react-native-shop"

echo "📦 Building Expo Web app..."
cd "$PROJECT_DIR"
npm install
npx expo export --platform web --clear

if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ Build directory not found: $BUILD_DIR"
  exit 1
fi

echo "📁 Preparing Nginx directory..."
sudo mkdir -p "$NGINX_DIR"
sudo rm -rf "$NGINX_DIR"/*

echo "📄 Copying build files..."
sudo cp -r "$BUILD_DIR"/* "$NGINX_DIR"/
sudo chown -R www-data:www-data "$NGINX_DIR"

if [ ! -f "$NGINX_SITE" ]; then
  echo "⚠️ Nginx site config not found at $NGINX_SITE"
  echo "Create it first before continuing."
  exit 1
fi

echo "🔗 Enabling Nginx site..."
sudo ln -sfn "$NGINX_SITE" "$NGINX_LINK"

echo "🧪 Testing Nginx config..."
sudo nginx -t

echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Checking local response..."
curl -I http://localhost || true

echo "🚀 Deployment complete"
echo "🌐 URL: https://ui.shk-uat-chipie.uk"
```

Make it executable:

```bash
chmod +x /opt/react-native-shop/deploy.sh
```

Run it anytime with:

```bash
cd /opt/react-native-shop
./deploy.sh
```

---

## 8. Recommended quick redeploy flow

Whenever code changes:

```bash
cd /opt/react-native-shop
git pull
./deploy.sh
```

If dependencies changed heavily:

```bash
cd /opt/react-native-shop
npm install
./deploy.sh
```

---

## 9. Verification checklist

### Verify build output

```bash
ls -la /opt/react-native-shop/dist
```

### Verify deployed files

```bash
ls -la /var/www/react-native-shop
```

### Verify Nginx config

```bash
sudo nginx -t
```

### Verify Nginx serves locally

```bash
curl -I http://localhost
curl http://localhost | head
```

### Verify cloudflared

```bash
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -n 50 --no-pager
```

### Verify public DNS from your local machine

```bash
nslookup ui.shk-uat-chipie.uk
```

---

## 10. Troubleshooting

### Problem: site works on `localhost` but not on public URL
Cause:
- Cloudflare DNS record points to the wrong tunnel, or
- tunnel ingress missing/wrong

Fix:
- confirm `/etc/cloudflared/config.yml` contains:

```yaml
- hostname: ui.shk-uat-chipie.uk
  service: http://localhost:80
```

- confirm Cloudflare DNS `ui` Tunnel record points to the correct tunnel

### Problem: `cloudflared tunnel route dns` says record already exists
Cause:
- existing DNS record already uses that hostname

Fix:
- delete or edit the record in Cloudflare DNS, then rerun the command

### Problem: Nginx is enabled but app still not loading
Check:

```bash
ls -la /var/www/react-native-shop
curl -I http://localhost
cat /etc/nginx/sites-available/react-native-shop
```

### Problem: SSH disconnects during setup
Add to local `~/.ssh/config`:

```sshconfig
Host *
    ServerAliveInterval 30
    ServerAliveCountMax 6
```

---

## 11. Final architecture

Request flow:

1. Browser opens `https://ui.shk-uat-chipie.uk`
2. Cloudflare DNS resolves the hostname
3. Cloudflare Tunnel forwards request to this VM
4. `cloudflared` sends traffic to `http://localhost:80`
5. Nginx serves files from `/var/www/react-native-shop`
6. Expo web app loads

---

## 12. Useful commands summary

```bash
# Build
cd /opt/react-native-shop
npx expo export --platform web --clear

# Deploy files
sudo rm -rf /var/www/react-native-shop/*
sudo cp -r /opt/react-native-shop/dist/* /var/www/react-native-shop/
sudo chown -R www-data:www-data /var/www/react-native-shop

# Nginx
sudo nginx -t
sudo systemctl reload nginx

# Local test
curl -I http://localhost

# Tunnel
sudo cat /etc/cloudflared/config.yml
sudo systemctl restart cloudflared
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -n 50 --no-pager

# DNS route
cloudflared tunnel route dns 1edf3ed6-48cd-4441-be8f-1d77f2021cc6 ui.shk-uat-chipie.uk
```
