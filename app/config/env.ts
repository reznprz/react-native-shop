import * as dotenv from 'dotenv';

export type EnvName = 'local' | 'uat' | 'prod';

export type PublicEnv = {
  env: EnvName;
  apiBaseURL: string;
  tokenBaseURL: string;
  debug: boolean;
};

function must(value: string | undefined, key: string, dotenvFile: string): string {
  if (!value) throw new Error(`Missing ${key} in ${dotenvFile}`);
  return value;
}

function parseEnvName(value: string, dotenvFile: string): EnvName {
  if (value === 'local' || value === 'uat' || value === 'prod') return value;
  throw new Error(`Invalid EXPO_PUBLIC_ENV="${value}" in ${dotenvFile}. Use local|uat|prod.`);
}

export function loadPublicEnv(): { env: PublicEnv; dotenvFile: string } {
  const dotenvFile = process.env.DOTENV_FILE ?? '.env';
  dotenv.config({ path: dotenvFile });

  const env = parseEnvName(process.env.EXPO_PUBLIC_ENV ?? 'local', dotenvFile);

  const apiBaseURL = must(
    process.env.EXPO_PUBLIC_API_BASE_URL,
    'EXPO_PUBLIC_API_BASE_URL',
    dotenvFile,
  );
  const tokenBaseURL = must(
    process.env.EXPO_PUBLIC_TOKEN_BASE_URL,
    'EXPO_PUBLIC_TOKEN_BASE_URL',
    dotenvFile,
  );

  const debug = (process.env.EXPO_PUBLIC_DEBUG ?? 'false') === 'true';

  return {
    dotenvFile,
    env: { env, apiBaseURL, tokenBaseURL, debug },
  };
}
