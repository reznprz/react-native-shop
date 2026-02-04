const dotenv = require('dotenv');
const { readFileSync, existsSync } = require('fs');
const { ExpoIdentity, getUpdatesUrl } = require('./app/config/expo.identity');

// ---------- helpers ----------
function getPackageVersion() {
  try {
    const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

// Normalize env to one of: local|uat|prod
function normalizeEnv(v) {
  const raw = String(v || '').trim().toLowerCase();
  if (raw === 'prod' || raw === 'production') return 'prod';
  if (raw === 'uat') return 'uat';
  return 'local';
}

// Figure out env from (in priority order):
// 1) EXPO_PUBLIC_ENV
// 2) EAS_BUILD_PROFILE (set by EAS)
// 3) profile name (sometimes available as EAS_PROFILE / etc)
// 4) default local
function resolveEnv() {
  if (process.env.EXPO_PUBLIC_ENV) return normalizeEnv(process.env.EXPO_PUBLIC_ENV);

  // EAS sets this during builds (local + remote)
  if (process.env.EAS_BUILD_PROFILE) return normalizeEnv(process.env.EAS_BUILD_PROFILE);

  // fallbacks (harmless)
  if (process.env.EAS_PROFILE) return normalizeEnv(process.env.EAS_PROFILE);

  return 'local';
}

// Decide dotenv file when DOTENV_FILE isn't explicitly set
function resolveDotenvFile(env) {
  if (process.env.DOTENV_FILE && String(process.env.DOTENV_FILE).trim()) {
    return String(process.env.DOTENV_FILE).trim();
  }

  // default mapping
  if (env === 'uat') return '.env.uat';
  if (env === 'prod') return '.env.prod';
  return '.env.local';
}

// Load dotenv only if needed
function maybeLoadDotenv(dotenvFile) {
  // If values already injected (dotenv-cli, CI env, etc.), don't override.
  const hasCore =
    !!process.env.EXPO_PUBLIC_API_BASE_URL &&
    !!process.env.EXPO_PUBLIC_TOKEN_BASE_URL;

  if (hasCore) return;

  if (!dotenvFile || !existsSync(dotenvFile)) return;

  dotenv.config({
    path: dotenvFile,
    override: false, // do not override already-set env vars
  });
}

function must(name, v) {
  if (!v || !String(v).trim()) {
    const dot = process.env.DOTENV_FILE || 'auto';
    throw new Error(`Missing env: ${name} (DOTENV_FILE=${dot})`);
  }
  return String(v).trim();
}

// ---------- config ----------
module.exports = ({ config }) => {
  const env = resolveEnv(); // local|uat|prod
  const dotenvFile = resolveDotenvFile(env);

  // make DOTENV_FILE visible for error messages/logging
  process.env.DOTENV_FILE = dotenvFile;

  // IMPORTANT: we load dotenv ourselves (Expo is prevented by EXPO_NO_DOTENV=1)
  maybeLoadDotenv(dotenvFile);

  const apiBaseURL = must('EXPO_PUBLIC_API_BASE_URL', process.env.EXPO_PUBLIC_API_BASE_URL);
  const tokenBaseURL = must('EXPO_PUBLIC_TOKEN_BASE_URL', process.env.EXPO_PUBLIC_TOKEN_BASE_URL);
  const debug = String(process.env.EXPO_PUBLIC_DEBUG || 'false').toLowerCase() === 'true';

  const version = getPackageVersion();
  const previousExtra = config.extra || {};

  const extra = {
    ...previousExtra,
    env,
    eas: { projectId: ExpoIdentity.projectId },
    app: {
      env,
      apiBaseURL,
      tokenBaseURL,
      debug,
      version,
    },
  };

  return {
    ...config,

    // Identity
    name: `SHK (${env})`,
    slug: ExpoIdentity.slug,
    owner: ExpoIdentity.owner,
    version,

    // Runtime/versioning
    runtimeVersion: `${version}-${env}`,

    // Updates
    updates: { url: getUpdatesUrl() },

    // MUST exist for non-interactive builds
    android: {
      ...(config.android || {}),
      package: ExpoIdentity.androidPackage,
    },
    ios: {
      ...(config.ios || {}),
      bundleIdentifier: ExpoIdentity.iosBundleIdentifier,
    },

    extra,
  };
};
