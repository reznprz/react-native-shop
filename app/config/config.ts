import {
  EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_TOKEN_BASE_URL,
  EXPO_PUBLIC_ENV,
  EXPO_PUBLIC_DEBUG,
} from '@env';

export type Env = 'local' | 'uat' | 'prod';

export interface AppConfig {
  tokenBaseURL: string;
  apiBaseURL: string;
  env: Env;
  debug: boolean;
}

export const config: AppConfig = {
  tokenBaseURL: EXPO_PUBLIC_TOKEN_BASE_URL,
  apiBaseURL: EXPO_PUBLIC_API_BASE_URL,
  env: EXPO_PUBLIC_ENV as Env,
  debug: EXPO_PUBLIC_DEBUG === 'true',
};
