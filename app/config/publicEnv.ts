// src/config/publicEnv.ts
export type Env = "local" | "uat" | "prod";

export type PublicEnv = {
  env: Env;
  apiBaseURL: string;
  tokenBaseURL: string;
  debug: boolean;
};

function must(v: string | undefined, key: string): string {
  if (!v) throw new Error(`Missing ${key} in ${process.env.DOTENV_FILE ?? ".env"}`);
  return v;
}

function parseEnv(v: string | undefined): Env {
  const value = (v ?? "local") as string;
  if (value === "local" || value === "uat" || value === "prod") return value;
  throw new Error(`Invalid EXPO_PUBLIC_ENV="${value}". Use local|uat|prod.`);
}

export function readPublicEnvFromProcess(): PublicEnv {
  const env = parseEnv(process.env.EXPO_PUBLIC_ENV);
  const apiBaseURL = must(process.env.EXPO_PUBLIC_API_BASE_URL, "EXPO_PUBLIC_API_BASE_URL");
  const tokenBaseURL = must(process.env.EXPO_PUBLIC_TOKEN_BASE_URL, "EXPO_PUBLIC_TOKEN_BASE_URL");
  const debug = (process.env.EXPO_PUBLIC_DEBUG ?? "false") === "true";

  return { env, apiBaseURL, tokenBaseURL, debug };
}
