import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

interface ExpoConfigWithEAS extends ExpoConfig {
    eas?: {
      projectId: string;
    };
  }

export default ({ config }: ConfigContext): ExpoConfigWithEAS => ({
  ...config,

  eas: {
    projectId: 'bd6f8b22-cb19-4111-9e6e-750d576fe5d9',
  } as any,

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
