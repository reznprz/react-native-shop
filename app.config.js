const dotenv = require('dotenv');
const { readFileSync } = require('fs');
const { ExpoIdentity, getUpdatesUrl } = require('./app/config/expo.identity');

function must(name, v) {
  if (!v || !String(v).trim()) {
    throw new Error(`Missing env: ${name} (DOTENV_FILE=${process.env.DOTENV_FILE || '.env'})`);
  }
  return String(v);
}

function parseEnv(v) {
  const value = String(v || 'local').trim();
  if (value === 'local' || value === 'uat' || value === 'prod') return value;
  throw new Error(`Invalid EXPO_PUBLIC_ENV="${value}". Use local|uat|prod.`);
}

function getPackageVersion() {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
  return pkg.version || '0.0.0';
}

module.exports = ({ config }) => {
  dotenv.config({ path: process.env.DOTENV_FILE || '.env' });

  const env = parseEnv(process.env.EXPO_PUBLIC_ENV);
  const apiBaseURL = must('EXPO_PUBLIC_API_BASE_URL', process.env.EXPO_PUBLIC_API_BASE_URL);
  const tokenBaseURL = must('EXPO_PUBLIC_TOKEN_BASE_URL', process.env.EXPO_PUBLIC_TOKEN_BASE_URL);
  const debug = (process.env.EXPO_PUBLIC_DEBUG || 'false') === 'true';
  const version = getPackageVersion();

  const previousExtra = config.extra || {};
  const previousEas = previousExtra.eas || {};

  const extra = {
    ...previousExtra,

    // convenience
    env,

    // use centralized identity (keep any existing fields in eas)
    eas: {
      ...previousEas,
      projectId: previousEas.projectId || ExpoIdentity.projectId,
    },

    // runtime config consumed by app/config/config.ts
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
    name: `SHK (${env})`,
    slug: ExpoIdentity.slug,
    owner: ExpoIdentity.owner,
    version,
    runtimeVersion: { policy: 'appVersion' },
    updates: { url: getUpdatesUrl() },
  
    ios: {
      ...(config.ios ?? {}),
      bundleIdentifier: config.ios?.bundleIdentifier ?? 'com.reznprz.reactnativeshop',
      supportsTablet: true,
    },
  
    android: {
      ...(config.android ?? {}),
      package: config.android?.package ?? 'com.sajilohisabkitab.shop',
    },
  
    extra,
  };
};  
