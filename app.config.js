// app.config.js
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const { ExpoIdentity, getUpdatesUrl } = require('./app/config/expo.identity');

function isEasCloudBuild() {
  // EAS Cloud always sets EAS_BUILD=true. EAS_BUILD_PROFILE is also usually set.
  return String(process.env.EAS_BUILD || '').toLowerCase() === 'true' || !!process.env.EAS_BUILD_PROFILE;
}

function getPackageVersion() {
  const pkgPath = path.resolve(__dirname, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  return pkg.version || '0.0.0';
}

function normalizeAppEnv(raw) {
  const env = String(raw || '').trim().toLowerCase();
  if (!env) return 'local';
  if (env === 'prod') return 'production';
  return env;
}

/**
 * IMPORTANT CHANGE (Fix 2):
 * Do NOT use NODE_ENV to decide UAT/PROD/LOCAL.
 * Only explicit env vars should decide the app env.
 */
function resolveAppEnv() {
  return normalizeAppEnv(process.env.EXPO_PUBLIC_ENV || process.env.APP_ENV || 'local');
}

function resolveDotenvFileLocal(appEnv) {
  // Explicit knob wins (what you're doing locally: DOTENV_FILE=.env.uat)
  if (process.env.DOTENV_FILE) return process.env.DOTENV_FILE;

  if (appEnv === 'uat') return '.env.uat';
  if (appEnv === 'production') return '.env.prod';

  if (fs.existsSync(path.resolve(__dirname, '.env.local'))) return '.env.local';
  return '.env';
}

/**
 * Load dotenv ONLY on local machine.
 * On EAS Cloud: do nothing. EAS should provide env vars via eas.json/dashboard.
 */
function maybeLoadDotenvLocal(appEnv) {
  if (isEasCloudBuild()) return;

  const noDotenv = String(process.env.EXPO_NO_DOTENV || '') === '1';
  const file = resolveDotenvFileLocal(appEnv);

  // If dotenv is disabled and we didn't explicitly select DOTENV_FILE, skip implicit ".env"
  if (noDotenv && path.basename(file) === '.env' && !process.env.DOTENV_FILE) return;

  const abs = path.resolve(__dirname, file);
  if (!fs.existsSync(abs)) return;

  dotenv.config({ path: abs, override: false });
}

function must(name, appEnv) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    const where = isEasCloudBuild()
      ? 'EAS Cloud env (eas.json env / EAS dashboard vars)'
      : `dotenv (${resolveDotenvFileLocal(appEnv)}) or shell env`;
    throw new Error(`Missing env: ${name} (appEnv=${appEnv}, source=${where})`);
  }
  return String(v).trim();
}

module.exports = ({ config }) => {
  // Logs (you want these visible in "Read app config")
  console.log('[app.config] isEasCloudBuild=', isEasCloudBuild());
  console.log('[app.config] EAS_BUILD=', process.env.EAS_BUILD);
  console.log('[app.config] EAS_BUILD_PROFILE=', process.env.EAS_BUILD_PROFILE);
  console.log('[app.config] EXPO_PUBLIC_ENV=', process.env.EXPO_PUBLIC_ENV);
  console.log('[app.config] APP_ENV=', process.env.APP_ENV);
  console.log('[app.config] DOTENV_FILE=', process.env.DOTENV_FILE);
  console.log('[app.config] EXPO_NO_DOTENV=', process.env.EXPO_NO_DOTENV);

  // Resolve env BEFORE loading dotenv
  const appEnv = resolveAppEnv();

  // Load dotenv locally only (never on EAS Cloud)
  maybeLoadDotenvLocal(appEnv);

  // Re-resolve after dotenv load (local case), because dotenv may have set EXPO_PUBLIC_ENV.
  // On EAS Cloud, dotenv doesn't run, so this doesn't change.
  const appEnvFinal = resolveAppEnv();

  console.log('[app.config] appEnv(before dotenv)=', appEnv);
  console.log('[app.config] appEnv(final)=', appEnvFinal);

  const apiBaseURL = must('EXPO_PUBLIC_API_BASE_URL', appEnvFinal);
  const tokenBaseURL = must('EXPO_PUBLIC_TOKEN_BASE_URL', appEnvFinal);
  const debug = String(process.env.EXPO_PUBLIC_DEBUG ?? 'false').toLowerCase() === 'true';

  const version = getPackageVersion();

  // Visible signature INSIDE the config output (even if logs are hard to find)
  const signature = `app.config.js|env=${appEnvFinal}|eas=${isEasCloudBuild()}|${new Date().toISOString()}`;

  const previousExtra = config.extra || {};
  const extra = {
    ...previousExtra,
    __CONFIG_SIG: signature,
    env: appEnvFinal,
    eas: { projectId: ExpoIdentity.projectId },
    app: { env: appEnvFinal, apiBaseURL, tokenBaseURL, debug, version },
  };

  return {
    ...config,
    name: `SHK (${appEnvFinal})`,
    slug: ExpoIdentity.slug,
    owner: ExpoIdentity.owner,
    version,
    runtimeVersion: `${version}-${appEnvFinal}`,
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
