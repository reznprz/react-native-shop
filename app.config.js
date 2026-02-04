// app.config.js
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const { ExpoIdentity, getUpdatesUrl } = require('./app/config/expo.identity');

function isEasCloudBuild() {
  return String(process.env.EAS_BUILD || '').toLowerCase() === 'true' || !!process.env.EAS_BUILD_PROFILE;
}

function getPackageVersion() {
  const pkgPath = path.resolve(__dirname, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  return pkg.version || '0.0.0';
}

function normalizeEnv(raw) {
  const env = String(raw || '').trim().toLowerCase();
  if (!env) return 'local';
  if (env === 'prod') return 'production';
  return env;
}

/**
 * FIX 2:
 * Never use NODE_ENV to decide app flavor.
 * Only use EXPO_PUBLIC_ENV (and optionally APP_ENV for local convenience).
 */
function resolveAppEnv() {
  return normalizeEnv(process.env.EXPO_PUBLIC_ENV || process.env.APP_ENV || 'local');
}

function resolveDotenvFileLocal(appEnv) {
  if (process.env.DOTENV_FILE) return process.env.DOTENV_FILE;

  if (appEnv === 'uat') return '.env.uat';
  if (appEnv === 'production') return '.env.prod';

  if (fs.existsSync(path.resolve(__dirname, '.env.local'))) return '.env.local';
  return '.env';
}

function maybeLoadDotenvLocal(appEnv) {
  // On EAS Cloud: NEVER read dotenv files from disk
  if (isEasCloudBuild()) return;

  const noDotenv = String(process.env.EXPO_NO_DOTENV || '') === '1';
  const file = resolveDotenvFileLocal(appEnv);

  // If dotenv is disabled and no explicit DOTENV_FILE, skip implicit ".env"
  if (noDotenv && path.basename(file) === '.env' && !process.env.DOTENV_FILE) return;

  const abs = path.resolve(__dirname, file);
  if (!fs.existsSync(abs)) return;

  dotenv.config({ path: abs, override: false });
}

function must(name, appEnv) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    const where = isEasCloudBuild()
      ? 'EAS Cloud env vars (Dashboard / eas.json)'
      : `dotenv (${resolveDotenvFileLocal(appEnv)}) or shell env`;
    throw new Error(`Missing env: ${name} (appEnv=${appEnv}, source=${where})`);
  }
  return String(v).trim();
}

module.exports = ({ config }) => {
  // Useful logs (may or may not show in EAS UI)
  console.log('[app.config] isEasCloudBuild=', isEasCloudBuild());
  console.log('[app.config] EAS_BUILD=', process.env.EAS_BUILD);
  console.log('[app.config] EAS_BUILD_PROFILE=', process.env.EAS_BUILD_PROFILE);
  console.log('[app.config] EXPO_PUBLIC_ENV=', process.env.EXPO_PUBLIC_ENV);
  console.log('[app.config] APP_ENV=', process.env.APP_ENV);
  console.log('[app.config] DOTENV_FILE=', process.env.DOTENV_FILE);
  console.log('[app.config] EXPO_NO_DOTENV=', process.env.EXPO_NO_DOTENV);

  // Resolve env, then load dotenv locally, then resolve again
  const appEnvBefore = resolveAppEnv();
  maybeLoadDotenvLocal(appEnvBefore);
  const appEnv = resolveAppEnv();

  console.log('[app.config] appEnv(before)=', appEnvBefore);
  console.log('[app.config] appEnv(final)=', appEnv);

  // FAIL FAST: no placeholders
  const apiBaseURL = must('EXPO_PUBLIC_API_BASE_URL', appEnv);
  const tokenBaseURL = must('EXPO_PUBLIC_TOKEN_BASE_URL', appEnv);
  const debug = String(process.env.EXPO_PUBLIC_DEBUG ?? 'false').toLowerCase() === 'true';

  const version = getPackageVersion();

  // Visible signature in the printed config
  const signature = `app.config.js|env=${appEnv}|eas=${isEasCloudBuild()}|${new Date().toISOString()}`;

  const previousExtra = config.extra || {};
  const extra = {
    ...previousExtra,
    __CONFIG_SIG: signature,
    env: appEnv,
    eas: { projectId: ExpoIdentity.projectId },
    app: { env: appEnv, apiBaseURL, tokenBaseURL, debug, version },
  };

  return {
    ...config,
    name: `SHK (${appEnv})`,
    slug: ExpoIdentity.slug,
    owner: ExpoIdentity.owner,
    version,
    runtimeVersion: `${version}-${appEnv}`,
    updates: { url: getUpdatesUrl() },
    ios: {
      ...(config.ios || {}),
      bundleIdentifier: ExpoIdentity.iosBundleIdentifier,
    },
    android: {
      ...(config.android || {}),
      package: ExpoIdentity.androidPackage,
    },
    extra,
  };
};
