import * as dotenv from "dotenv";
import { ExpoConfig, ConfigContext } from "@expo/config";
import fs from "fs";
import path from "path";

dotenv.config({
  path: process.env.DOTENV_FILE ?? ".env",
});

type VersionState = {
  version: string;
  iosBuildNumber: number;
  androidVersionCode: number;
};

function readVersionState(): VersionState {
  const p = path.resolve(process.cwd(), "version.json");
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw) as VersionState;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const v = readVersionState();

  return {
    ...config,

    /** dynamic branding */
    name: `SHK (${process.env.EXPO_PUBLIC_ENV ?? "dev"})`,
    slug: "sajilohisabkitab",

    /** single source of truth */
    version: v.version,

    orientation: "portrait",
    icon: "./assets/restaurant.png",

    ios: {
      ...(config.ios ?? {}),
      supportsTablet: true,
      bundleIdentifier: "com.reznprz.reactnativeshop",
      buildNumber: String(v.iosBuildNumber), // iOS requires string
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },

    android: {
      ...(config.android ?? {}),
      package: "com.sajilohisabkitab.shop",
      versionCode: v.androidVersionCode, // Android requires integer
      adaptiveIcon: {
        foregroundImage: "./assets/restaurant.png",
        backgroundColor: "#ffffff",
      },
    },

    extra: {
      ...config.extra,
      eas: config.extra?.eas ?? {
        projectId: "589511b4-857b-41b4-92c8-3b1a4df4e2a2",
      },
      env: process.env.EXPO_PUBLIC_ENV,
    },

    runtimeVersion: {
      policy: "appVersion", // will follow v.version
    },

    updates: {
      url: "https://u.expo.dev/589511b4-857b-41b4-92c8-3b1a4df4e2a2",
    },

    plugins: ["expo-asset"],
    owner: "shk25",
  };
};
