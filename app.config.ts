import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  
  /** dynamic branding */
  name: `MyApp (${process.env.EXPO_PUBLIC_ENV})`,
  slug: 'react-native-shop',  // 
  
  /** native metadata */
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',

  /** merge existing extra properties with dynamic values */
  extra: {
    ...(config.extra || {}), // include any existing extra properties (like eas)
    // Ensure that extra.eas exists
    eas: config.extra?.eas ?? { projectId: 'bd6f8b22-cb19-4111-9e6e-750d576fe5d9' },
    // Your dynamic environment value
    env: process.env.EXPO_PUBLIC_ENV,
  },
});
