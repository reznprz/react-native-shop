🚀 Release & Deployment Process (Approach C)

TL;DR:
We use a release branch model (Approach C) with explicit versioning, automated tagging, OTA updates, store builds, and automatic sync back to develop.

This system is designed to be:

predictable

auditable

safe for production

easy for new team members to follow

🌿 Branching Model
Long-lived branches
Branch Purpose
develop Default branch, active development
master Production-ready code only
Short-lived branches
Branch Purpose
feature/_ Feature development
release/x.y.z Release stabilization & QA
hotfix/x.y.z Emergency production fixes
🔁 High-Level Flow (Approach C)
flowchart LR
F[feature/_] --> D[develop]
D --> R[release/x.y.z]
R -->|QA & fixes| R
R --> M[master]
M -->|sync back| D

🔢 Versioning Rules

We follow Semantic Versioning:

MAJOR.MINOR.PATCH

Type When
MAJOR Breaking change
MINOR New feature
PATCH Bug fix
Single Source of Truth

Version lives only in package.json

CI reads it from there

Expo runtime, OTA, and builds use the same value

🧬 Release Lifecycle (Step-by-Step)
1️⃣ Feature Development
feature/\* → develop

No version bump

No production deployment

Free iteration

2️⃣ Cut a Release Branch

When ready to ship:

git checkout develop
git pull
git checkout -b release/1.4.0

Manually bump version (important)
yarn version --new-version 1.4.0 --no-git-tag-version
git commit -am "chore(release): bump version to 1.4.0"
git push origin release/1.4.0

📌 Why manual?
Humans decide MAJOR/MINOR/PATCH.
CI enforces correctness — it doesn’t guess.

3️⃣ QA & Fixes (Release Branch)

All fixes go into the same release branch:

release/1.4.0
├─ fix/layout
├─ fix/payment
└─ fix/api-timeout

🚫 No new features allowed.

4️⃣ Merge Release → Master (🚨 Critical Moment)

Create PR:

release/1.4.0 → master

On merge, CI automatically:

sequenceDiagram
participant PR
participant CI
participant Git
participant Expo

PR->>CI: release/\* merged into master
CI->>Git: create tag v1.4.0
CI->>Git: create GitHub Release notes
CI->>Expo: eas update (production)
CI->>Expo: eas build (iOS + Android)
CI->>Git: open PR master → develop

⚙️ CI/CD Architecture
🟢 Release Workflow (release-to-master.yml)

Triggered by:

PR merged: release/\* → master

Responsibilities:

Validate release integrity

Create tag vX.Y.Z

Create GitHub Release notes

Sync master → develop

Call deployment workflow

🚀 Deploy Workflow (deploy-prod.yml)

Reusable workflow, triggered by:

release workflow (workflow_call)

manual trigger (workflow_dispatch)

Steps:

Load .env.prod

Preflight bundle (expo export)

eas update (OTA)

eas build (iOS + Android)

📲 Expo / EAS Strategy
OTA Updates

Branch: production

Used for:

hotfixes

small patches

emergency updates

Builds

Profile: production

iOS → App Store

Android → Play Store (AAB)

🧪 PR Preflight Checks

Every PR to develop or master runs:

Dependency install

(Optional) TypeScript check

Expo bundling (expo export)

This prevents:

missing packages

broken imports

runtime crashes

CI failures at deploy time

🧾 ONE-PAGE CHEAT SHEET
Feature work?
feature/\* → develop

Ready to release?
develop → release/x.y.z
bump version
QA & fixes

Ship it?
release/x.y.z → master
CI does: - tag - release notes - OTA - store builds - sync back

✅ HUMAN RELEASE CHECKLIST

Before merging release/x.y.z → master:

Version in package.json is correct

QA passed on release branch

No feature commits after release cut

Preflight CI is green

.env.prod secrets exist in GitHub

Expo project ID is correct

You are mentally ready 😄

After merge:

Verify GitHub Release exists

Verify EAS update ran

Verify EAS build started

Review sync PR master → develop

🔥 Hotfix Flow (Production Emergency)
flowchart LR
M[master] --> H[hotfix/x.y.z]
H --> M
M --> D[develop]

Steps:

Create hotfix/x.y.z from master

Bump PATCH version

Fix bug

Merge to master

CI deploys automatically

Sync back to develop

🧠 Why We Use Approach C
Reason Benefit
Release branches Predictable releases
Manual versioning No accidental bumps
CI-enforced tagging Immutable history
Reusable deploy workflow Reliable deployments
Auto sync back No branch drift

---

Flow

1️⃣ Overall Branching & Release Flow (Approach C)
flowchart LR
F[feature/*] --> D[develop]
D --> R[release/x.y.z]
R -->|QA & fixes| R
R --> M[master]
M -->|auto sync| D

2️⃣ Detailed Release Lifecycle (Human + CI)
flowchart TD
A[Merge feature/* → develop] --> B[Create release/x.y.z]
B --> C[Manually bump version in package.json]
C --> D[QA & bug fixes]
D --> E[Merge release/x.y.z → master]

E --> F[CI: Guard checks]
F --> G[CI: Create tag vX.Y.Z]
G --> H[CI: GitHub Release notes]
H --> I[CI: Trigger production deploy]
I --> J[CI: Sync master → develop]

3️⃣ CI/CD Pipeline (Release → Deploy)
sequenceDiagram
participant Dev as Developer
participant GitHub as GitHub PR
participant CI as GitHub Actions
participant Expo as Expo / EAS

Dev->>GitHub: Merge release/x.y.z → master
GitHub->>CI: Trigger release-to-master workflow

CI->>CI: Validate release integrity
CI->>GitHub: Create tag vX.Y.Z
CI->>GitHub: Create GitHub Release notes

CI->>Expo: eas update (production)
CI->>Expo: eas build (iOS + Android)

CI->>GitHub: Open PR master → develop

4️⃣ PR Preflight (Quality Gate)
flowchart LR
PR[Pull Request] --> CI[PR Preflight CI]
CI --> A[Install dependencies]
A --> B[TypeScript check]
B --> C[Expo bundle check]
C -->|pass| D[Allow merge]
C -->|fail| E[Block merge]

5️⃣ Expo Strategy (OTA vs Store Builds)
flowchart LR
V[Version in package.json] --> OTA[eas update<br/>branch: production]
V --> BUILD[eas build<br/>profile: production]

OTA --> Users[Existing users]
BUILD --> Stores[App Store / Play Store]

6️⃣ Hotfix Flow (Emergency Production Fix)
flowchart LR
M[master] --> H[hotfix/x.y.z]
H --> M
M -->|auto sync| D[develop]

7️⃣ What Happens Automatically vs Manually
flowchart TD
H[Human] -->|decides version| V[package.json]
V --> CI[CI Pipeline]

CI --> T[Tag vX.Y.Z]
CI --> R[GitHub Release]
CI --> OTA[OTA Update]
CI --> B[Store Builds]
CI --> S[Sync develop]

---

flowchart TD
A[".env.* files\n(local/uat/prod)"] -->|DOTENV*FILE| B["app.config.js\n(Node eval time)"]
B --> C["Validates required EXPO_PUBLIC*\* vars\n(must())"]
B --> D["Reads package.json version\n(single source of truth)"]
B --> E["Injects expo.extra\nextra.env + extra.app"]
E --> F["expo config / expo export / eas build\nbundling step"]
F --> G["App runtime\n(Expo Go / Dev / Prod)"]
G --> H["app/config/config.ts\nreads Constants.expoConfig.extra\nand Updates.manifest.extra"]
H --> I["Typed config object\n(apiBaseURL, tokenBaseURL, env, debug, version)"]
I --> J["App uses config\nAPI clients, UI labels, debugging"]

subgraph CI["CI / GitHub Actions"]
K["Generate .env.ci from secrets or placeholders"] --> B
L["Assert extra.app keys exist"] --> F
M["expo export (preflight bundle)"] --> F
end

subgraph EAS["EAS"]
N["EAS Update (OTA)\n--message vX.Y.Z"] --> G
O["EAS Build\nAndroid/iOS"] --> G
end
