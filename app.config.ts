import * as dotenv from 'dotenv';
import { ExpoConfig, ConfigContext } from '@expo/config';

dotenv.config({
  path: process.env.DOTENV_FILE ?? '.env',
});

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  /** dynamic branding */
  name: `MyApp (${process.env.EXPO_PUBLIC_ENV ?? 'dev'})`,
  slug: 'sajilohisabkitab',

  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',

  /** REQUIRED for Android builds */
  android: {
    package: 'com.sajilohisabkitab.shop',
  },

  extra: {
    ...config.extra,
    eas: config.extra?.eas ?? {
      projectId: '589511b4-857b-41b4-92c8-3b1a4df4e2a2',
    },
    env: process.env.EXPO_PUBLIC_ENV,
  },

  plugins: [
    'expo-asset',
  ],
});
