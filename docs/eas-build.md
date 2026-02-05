# Env + Expo + EAS Build Configuration Notes (SHK)

This document explains **why our Expo / EAS environment setup looks the way it does**,  
what problems we hit, and **which patterns are considered stable vs fragile**.

If you are changing `app.config.js`, build scripts, CI workflows, or environment variables,
**read this first**.

---

## 🧩 Problem Summary

We hit multiple failures where:

- EAS Build / EAS Update failed with:
  - `Missing env: EXPO_PUBLIC_API_BASE_URL`
  - `Missing config: expo.extra.app.apiBaseURL`
- Builds worked locally but failed on:
  - EAS Cloud
  - GitHub Actions
- UAT / Production builds accidentally resolved to `env=local`
- Metro bundling failed due to Node-only dependencies (e.g. `crypto`)

A key log that kept appearing:

[dotenv] injecting env (0) from .env.uat


This meant:
- dotenv *found* the file
- but loaded **zero variables**

---

## 🧠 Root Causes

### 1) `.env.*` files are NOT reliable on EAS Cloud

Even if `.env.uat` exists locally:

- EAS Cloud does **not guarantee** that `.env.*` files are:
  - uploaded
  - readable
  - parsed correctly
- `.easignore`, packaging, or CI behavior can exclude them
- Relying on `.env.*` inside `app.config.js` is fragile for remote builds

**Golden rule:**  
🚫 Never depend on `.env.*` files existing on remote EAS builders.

---

### 2) `DOTENV_FILE` alone is fragile

Even with:

```bash
EXPO_NO_DOTENV=1 DOTENV_FILE=.env.uat eas build
This can still fail because:

EAS runs npx expo config internally

subprocess env inheritance is not guaranteed

dotenv parsing can silently fail due to:

BOM / CRLF

hidden characters

indentation

malformed lines

3) Expo auto-loads .env unless disabled
If EXPO_NO_DOTENV=1 is not set, Expo will auto-load .env:

This caused placeholder values like:

https://your-api-base

to override real EAS env vars

4) EAS injects env vars after “Read app config”
During Read app config:

EAS_BUILD_PROFILE is available

build.<profile>.env may not be available yet

So profile name is the only reliable signal at that stage.

✅ What Actually Fixed It
✔️ dotenv-cli (key fix)
Using:

dotenv -e .env.uat -- eas build ...
works because:

dotenv-cli loads the file in the parent shell

exports vars into process.env

EAS never needs to read .env.* itself

This is why dotenv-cli “magically” fixed builds.

🏗️ Final Architecture (Stable Pattern)
1) Runtime config lives in expo.extra.app
All runtime config is injected here:

extra: {
  app: {
    env,
    apiBaseURL,
    tokenBaseURL,
    debug,
    version
  }
}
Runtime reads from:

Constants.expoConfig?.extra?.app
// or Updates.manifest.extra.app (OTA)
This works for:

Expo Go

Dev builds

EAS Build binaries

EAS Update (OTA)

2) Environment resolution rules
In app.config.js:

EAS Cloud

Resolve env from EAS_BUILD_PROFILE

uat → uat

production → production

Local

Use EXPO_PUBLIC_ENV / APP_ENV

Never silently fall back to local on EAS

Fail fast instead.

3) Where env vars come from (by environment)
🔹 Local development
.env.local, .env.uat, .env.prod

injected via dotenv-cli

NOT read implicitly by EAS

🔹 EAS Preview (UAT)
Expo Dashboard → Environment Variables

Environment: Preview

Visibility: Public

Required:

EXPO_PUBLIC_API_BASE_URL

EXPO_PUBLIC_TOKEN_BASE_URL

EXPO_PUBLIC_DEBUG

🔹 EAS Production
Expo Dashboard → Environment Variables

Environment: Production

Visibility: Public

Same keys as Preview

🚫 Do not rely on .env.prod in EAS Cloud.

4) eas.json rules
Use profiles only to:

select channel

select environment

set EXPO_NO_DOTENV=1

Do NOT store secrets here

URLs may be duplicated here, but dashboard is preferred

Example:

{
  "build": {
    "uat": {
      "environment": "preview",
      "env": {
        "EXPO_NO_DOTENV": "1"
      }
    },
    "production": {
      "environment": "production",
      "env": {
        "EXPO_NO_DOTENV": "1"
      }
    }
  }
}
🧪 Debugging Playbook
Check Expo config output
EXPO_NO_DOTENV=1 DOTENV_FILE=.env.uat npx expo config --type public
Simulate EAS Cloud locally
EAS_BUILD=true EAS_BUILD_PROFILE=uat EXPO_NO_DOTENV=1 \
EXPO_PUBLIC_API_BASE_URL=https://example.com \
EXPO_PUBLIC_TOKEN_BASE_URL=https://example.com \
npx expo config --type public
Check dotenv parsing
node -e "require('dotenv').config({ path: '.env.uat' }); console.log(process.env.EXPO_PUBLIC_API_BASE_URL)"
Detect hidden characters
cat -A .env.uat
🧵 CI / GitHub Actions Guidance
CI should not assume .env.* exists

Prefer:

env: blocks in workflow steps

or generate .env.ci explicitly

Run a preflight before EAS build:

expo config

expo export

PR builds:

ci:eas-build → UAT

ci:eas-build-prod → Production

Reusable workflow path must match exactly:

.github/workflows/pr-eas-build-android.yml
🚨 Metro / Axios Issue (Bonus)
Axios 1.13.x resolved to Node build (crypto) during bundling.

Fix:

Force browser build via metro.config.js

Pin axios to a stable version

Never allow Node-only modules in RN bundle.

✅ Key Takeaways
dotenv-cli works because it injects env early

.env.* files are unreliable on EAS Cloud

EAS_BUILD_PROFILE is the only reliable signal during config eval

Fail fast > silent fallback

expo.extra.app is the single source of truth

Dashboard env vars > repo env files for production