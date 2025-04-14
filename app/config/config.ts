type Env = 'local' | 'uat' | 'prod';

export interface AppConfig {
  tokenBaseURL: string;
  apiBaseURL: string;
  env: Env;
}

export const config: AppConfig = {
  tokenBaseURL: process.env.EXPO_PUBLIC_TOKEN_BASE_URL ?? '',
  apiBaseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
  env: (process.env.EXPO_PUBLIC_ENV as Env) ?? 'uat',
};
