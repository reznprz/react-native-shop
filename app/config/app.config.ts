import { ConfigContext, ExpoConfig } from '@expo/config';
import * as dotenv from 'dotenv';
import { readFileSync } from 'node:fs';
import { readPublicEnvFromProcess } from './publicEnv';
import { ExpoIdentity, getUpdatesUrl } from './expo';

function getPackageVersion(): string {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
  if (!pkg.version) throw new Error('package.json missing version');
  return pkg.version as string;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  // ONLY load env from DOTENV_FILE (Expo auto-dotenv is disabled via EXPO_NO_DOTENV=1 in scripts)
  dotenv.config({ path: process.env.DOTENV_FILE ?? '.env' });

  const version = getPackageVersion();
  const publicEnv = readPublicEnvFromProcess();

  // build a merged extra object ONCE (avoid accidental overwrite)
  const extra = {
    ...(config.extra ?? {}),
    env: publicEnv.env,
    eas: { projectId: ExpoIdentity.projectId },

    // MUST exist for runtime config
    app: {
      env: publicEnv.env,
      apiBaseURL: publicEnv.apiBaseURL,
      tokenBaseURL: publicEnv.tokenBaseURL,
      debug: publicEnv.debug,
      version,
    },
  };

  return {
    ...config,

    // Branding/identity
    name: `SHK (${publicEnv.env})`,
    slug: ExpoIdentity.slug,
    owner: ExpoIdentity.owner,

    // Versioning (single source of truth: package.json)
    version,
    runtimeVersion: { policy: 'appVersion' },

    // Updates
    updates: { url: getUpdatesUrl() },

    // set extra LAST
    extra,
  };
};
