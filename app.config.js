const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const { ExpoIdentity, getUpdatesUrl } = require('./app/config/expo.identity');

function isEasCloudBuild() {
  return String(process.env.EAS_BUILD || '').toLowerCase() === 'true' || !!process.env.EAS_BUILD_PROFILE;
}

function getPackageVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
  return pkg.version || '0.0.0';
}

function normalizeEnv(raw) {
  const env = String(raw || '').trim().toLowerCase();
  if (!env) return 'local';
  if (env === 'prod') return 'production';
  return env;
}

// Decide the flavor. Prefer profile when on EAS cloud.
function resolveAppEnv() {
  // 1) EAS Cloud: profile is most reliable
  if (isEasCloudBuild()) {
    const p = String(process.env.EAS_BUILD_PROFILE || '').trim().toLowerCase();
    if (p === 'uat') return 'uat';
    if (p === 'production') return 'production';
    // fallback to EXPO_PUBLIC_ENV if you want
    return normalizeEnv(process.env.EXPO_PUBLIC_ENV || 'local');
  }

  // 2) Local
  return normalizeEnv(process.env.EXPO_PUBLIC_ENV || process.env.APP_ENV || 'local');
}

function resolveDotenvFileLocal(appEnv) {
  if (process.env.DOTENV_FILE) return process.env.DOTENV_FILE;
  if (appEnv === 'uat') return '.env.uat';
  if (appEnv === 'production') return '.env.prod';
  if (fs.existsSync(path.resolve(__dirname, '.env.local'))) return '.env.local';
  return '.env';
}

// Local only. Cloud should never read from repo .env files.
function maybeLoadDotenvLocal(appEnv) {
  if (isEasCloudBuild()) return;

  const noDotenv = String(process.env.EXPO_NO_DOTENV || '') === '1';
  const file = resolveDotenvFileLocal(appEnv);

  if (noDotenv && path.basename(file) === '.env' && !process.env.DOTENV_FILE) return;

  const abs = path.resolve(__dirname, file);
  if (!fs.existsSync(abs)) return;

  dotenv.config({ path: abs, override: false });
}

function must(name, appEnv) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    const where = isEasCloudBuild()
      ? `EAS env vars (Dashboard) / profile=${process.env.EAS_BUILD_PROFILE}`
      : `dotenv (${resolveDotenvFileLocal(appEnv)}) or shell env`;
    throw new Error(`Missing env: ${name} (appEnv=${appEnv}, source=${where})`);
  }
  return String(v).trim();
}

module.exports = ({ config }) => {
  const appEnvBefore = resolveAppEnv();
  maybeLoadDotenvLocal(appEnvBefore);
  const appEnv = resolveAppEnv();

  // Read env vars ONLY (never placeholders)
  const apiBaseURL = must('EXPO_PUBLIC_API_BASE_URL', appEnv);
  const tokenBaseURL = must('EXPO_PUBLIC_TOKEN_BASE_URL', appEnv);
  const debug = String(process.env.EXPO_PUBLIC_DEBUG ?? 'false').toLowerCase() === 'true';
  const version = getPackageVersion();

  // Visible debug in EAS "Read app config" output
  const envProbe = {
    appEnvBefore,
    appEnvFinal: appEnv,
    EAS_BUILD: process.env.EAS_BUILD || null,
    EAS_BUILD_PROFILE: process.env.EAS_BUILD_PROFILE || null,
    EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV || null,
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ? process.env.EXPO_PUBLIC_API_BASE_URL.slice(0, 40) + '...' : null,
    EXPO_PUBLIC_TOKEN_BASE_URL: process.env.EXPO_PUBLIC_TOKEN_BASE_URL ? process.env.EXPO_PUBLIC_TOKEN_BASE_URL.slice(0, 40) + '...' : null,
    DOTENV_FILE: process.env.DOTENV_FILE || null
  };

  const signature = `app.config.js|env=${appEnv}|eas=${isEasCloudBuild()}|${new Date().toISOString()}`;

  // IMPORTANT:
  // Do NOT let config.extra.app from app.json override this.
  // We rebuild extra explicitly and only preserve unrelated keys.
  const prevExtra = (config.extra && typeof config.extra === 'object') ? config.extra : {};
  const { app: _discardApp, env: _discardEnv, __CONFIG_SIG: _discardSig, __ENV_PROBE: _discardProbe, ...keep } = prevExtra;

  const extra = {
    ...keep,
    __CONFIG_SIG: signature,
    __ENV_PROBE: envProbe,
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
    ios: { ...(config.ios || {}), bundleIdentifier: ExpoIdentity.iosBundleIdentifier },
    android: { ...(config.android || {}), package: ExpoIdentity.androidPackage },
    extra,
  };
};
