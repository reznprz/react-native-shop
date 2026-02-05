const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// --- keep your existing transformer config ---
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
  assetPlugins: ["expo-asset/tools/hashAssetFiles"],
};

// --- keep your svg extensions config ---
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

// Force axios to use browser build (prevents `crypto` import)
const defaultResolveRequest =
  config.resolver.resolveRequest ||
  ((context, moduleName, platform) => context.resolveRequest(context, moduleName, platform));

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "axios") {
    return defaultResolveRequest(context, "axios/dist/browser/axios.cjs", platform);
  }
  return defaultResolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
