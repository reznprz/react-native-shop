🧠 Configuration Architecture & Rationale (Expo / React Native)

This project intentionally does NOT use @env imports at runtime.
Instead, it uses Expo config (app.config.js) + expo.extra as the single source of truth for environment configuration.

This section explains why, how, and what commands are used for debugging.

❌ Why we moved away from @env
What @env does

Using babel-plugin-react-native-dotenv, you can write:

import { EXPO_PUBLIC_API_BASE_URL } from '@env';

This works by injecting environment variables at bundle time.

Why this becomes a problem (important)

@env breaks or becomes unreliable in:

EAS Build (CI / cloud)

Expo Updates (OTA)

Multiple environments (local / uat / prod)

When .env is not present in CI

When Expo CLI auto-loads envs unexpectedly

Common failure modes:

❌ “Variable not defined”

❌ Works locally, breaks in CI

❌ OTA update uses stale values

❌ Hard to debug which .env was used

👉 Enterprise rule:

App runtime should never directly depend on .env files.

✅ Why we use Expo config + expo.extra

Expo provides a first-class, supported mechanism to inject configuration:

Build time

app.config.js runs in Node

Reads .env

Validates required variables

Injects values into expo.extra

Runtime

App reads config via:

import Constants from 'expo-constants';

Works consistently in:

Expo Go

EAS Build

OTA Updates

Production stores

This gives us:

✅ One source of truth

✅ Deterministic behavior

✅ OTA-safe config

✅ CI-safe builds

🧩 Roles of config files (very important)
app.config.js (BUILD-TIME CONFIG)

Runs in Node. Never runs inside the app.

Responsibilities:

Load .env using dotenv

Validate required env variables

Read version from package.json

Inject runtime config into expo.extra.app

Define Expo identity (slug, owner, projectId)

Example:

extra: {
env: 'prod',
app: {
apiBaseURL,
tokenBaseURL,
debug,
version,
},
}

🚫 Must NOT:

Import TS files

Use path aliases

Use @env

app/config/config.ts (RUNTIME CONFIG)

Runs inside the app (JS bundle).

Responsibilities:

Read config from:

Constants.expoConfig.extra

Updates.manifest.extra (OTA)

Validate presence of required values

Expose a typed config object to the app

Example:

export const config = {
apiBaseURL: must(extra.app.apiBaseURL),
tokenBaseURL: must(extra.app.tokenBaseURL),
};

app/config/expo.identity.js (IDENTITY ONLY)

Node-safe constants shared by config and CI

Responsibilities:

Expo owner

Slug

Project ID

Updates URL

Why separate?

Avoid duplication

Avoid TS import issues

Safe for CI / GitHub Actions

🧪 Why we use this command for debugging
EXPO_NO_DOTENV=1 DOTENV_FILE=.env.local.debug npx expo config --type public

What this command does

Executes app.config.js

Prints the resolved Expo config

Shows exactly what will be embedded into the app

What each part means
Part Meaning
EXPO_NO_DOTENV=1 Disable Expo’s auto .env loading
DOTENV_FILE=.env.local.debug Explicitly choose which env file
expo config --type public Show final public config
Why this matters

Prevents double env loading

Makes config deterministic

Lets us debug CI vs local differences

Confirms extra.app is present

If this command shows correct values → builds and OTA will work.

🚨 Golden rules (do not break these)

❌ Do not import env variables directly in app code

❌ Do not use @env in runtime code

✅ All env validation happens in app.config.js

✅ App reads config only from Constants.expoConfig.extra

✅ Always debug with expo config --type public

🧠 Mental model (one sentence)

.env → app.config.js → expo.extra → app runtime
