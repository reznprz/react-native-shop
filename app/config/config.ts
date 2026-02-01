// src/config/config.ts
import Constants from "expo-constants";
import {
  EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_TOKEN_BASE_URL,
  EXPO_PUBLIC_ENV,
  EXPO_PUBLIC_DEBUG,
} from "@env";

export type Env = "local" | "uat" | "prod";

export interface AppConfig {
  tokenBaseURL: string;
  apiBaseURL: string;
  env: Env;
  debug: boolean;
  version: string;
}

function getExtra(): any {
  return (
    Constants.expoConfig?.extra ??
    Constants.manifest2?.extra ??
    // @ts-expect-error - varies by Expo runtime
    Constants.manifest?.extra ??
    {}
  );
}

function isEnv(v: any): v is Env {
  return v === "local" || v === "uat" || v === "prod";
}

function must<T>(v: T | undefined, key: string): T {
  if (v === undefined || v === null || v === ("" as any)) {
    throw new Error(`Missing config: ${key}`);
  }
  return v;
}

const extra = getExtra();
const app = extra.app ?? {};

const tokenBaseURL = app.tokenBaseURL ?? EXPO_PUBLIC_TOKEN_BASE_URL;
const apiBaseURL = app.apiBaseURL ?? EXPO_PUBLIC_API_BASE_URL;

const envRaw = app.env ?? EXPO_PUBLIC_ENV;
const env: Env = isEnv(envRaw) ? envRaw : "local";

const debug = typeof app.debug === "boolean" ? app.debug : EXPO_PUBLIC_DEBUG === "true";
const version = app.version ?? Constants.expoConfig?.version ?? "0.0.0";

export const config: AppConfig = {
  tokenBaseURL: must(tokenBaseURL, "tokenBaseURL"),
  apiBaseURL: must(apiBaseURL, "apiBaseURL"),
  env,
  debug,
  version,
};
