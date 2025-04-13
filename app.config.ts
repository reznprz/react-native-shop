import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  /** dynamic branding */
  name: `MyApp (${process.env.EXPO_PUBLIC_ENV})`,
  slug: 'my-app',

  /** native metadata still belongs here */
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',

  /** keep or drop `extra` as you like */
  extra: {
    env: process.env.EXPO_PUBLIC_ENV
  },
});
