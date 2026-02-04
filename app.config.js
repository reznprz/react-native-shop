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

function resolveAppEnv() {
  // DO NOT use NODE_ENV here
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
      ? 'EAS Cloud env vars (Dashboard / eas.json)'
      : `dotenv (${resolveDotenvFileLocal(appEnv)}) or shell env`;
    throw new Error(`Missing env: ${name} (appEnv=${appEnv}, source=${where})`);
  }
  return String(v).trim();
}

module.exports = ({ config }) => {
  const before = resolveAppEnv();
  maybeLoadDotenvLocal(before);
  const appEnv = resolveAppEnv();

  const apiBaseURL = must('EXPO_PUBLIC_API_BASE_URL', appEnv);
  const tokenBaseURL = must('EXPO_PUBLIC_TOKEN_BASE_URL', appEnv);
  const debug = String(process.env.EXPO_PUBLIC_DEBUG ?? 'false').toLowerCase() === 'true';
  const version = getPackageVersion();

  const envProbe = {
    EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV || null,
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ? 'SET' : null,
    EXPO_PUBLIC_TOKEN_BASE_URL: process.env.EXPO_PUBLIC_TOKEN_BASE_URL ? 'SET' : null,
    EXPO_PUBLIC_DEBUG: process.env.EXPO_PUBLIC_DEBUG || null,
    EAS_BUILD: process.env.EAS_BUILD || null,
    EAS_BUILD_PROFILE: process.env.EAS_BUILD_PROFILE || null,
  };

  const signature = `app.config.js|env=${appEnv}|eas=${isEasCloudBuild()}|${new Date().toISOString()}`;

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
    extra: {
      ...(config.extra || {}),
      __CONFIG_SIG: signature,
      __ENV_PROBE: envProbe,
      env: appEnv,
      eas: { projectId: ExpoIdentity.projectId },
      app: { env: appEnv, apiBaseURL, tokenBaseURL, debug, version },
    },
  };
};
