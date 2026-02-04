import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

export type Env = 'local' | 'uat' | 'prod' | 'production';

export interface AppConfig {
  tokenBaseURL: string;
  apiBaseURL: string;
  env: Env;
  debug: boolean;
  version: string;
}

function must(path: string, v: unknown): string {
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Missing config: ${path}`);
  }
  return v;
}

function getExtra(): any {
  // dev (expo go / dev client)
  const expoExtra = Constants.expoConfig?.extra;

  // prod OTA (eas update)
  const updateExtra = (Updates.manifest as any)?.extra;

  // legacy fallback
  const legacyExtra = (Constants as any).manifest?.extra;

  return expoExtra ?? updateExtra ?? legacyExtra ?? {};
}

const extra = getExtra();

const debugRaw = extra.app?.debug;
const debug =
  typeof debugRaw === 'boolean'
    ? debugRaw
    : String(debugRaw ?? 'false').toLowerCase() === 'true';

export const config: AppConfig = {
  env: (extra.app?.env ?? extra.env ?? 'local') as Env,
  debug,
  apiBaseURL: must('expo.extra.app.apiBaseURL', extra.app?.apiBaseURL),
  tokenBaseURL: must('expo.extra.app.tokenBaseURL', extra.app?.tokenBaseURL),
  version: must('expo.extra.app.version', extra.app?.version),
};
