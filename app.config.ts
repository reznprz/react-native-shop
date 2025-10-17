// app.config.ts
import * as dotenv from 'dotenv';
import { ExpoConfig, ConfigContext } from '@expo/config';

// Load the same file the Babel plugin is using
dotenv.config({
  path: process.env.DOTENV_FILE ?? '.env',
});

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  /** dynamic branding */
  name: `MyApp (${process.env.EXPO_PUBLIC_ENV ?? 'dev'})`,
  slug: 'react-native-shop',

  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',

  extra: {
    ...config.extra,
    eas: config.extra?.eas ?? {
      projectId: 'bd6f8b22-cb19-4111-9e6e-750d576fe5d9',
    },
    env: process.env.EXPO_PUBLIC_ENV,
  },
  plugins: [
    "expo-asset"
  ]
});
