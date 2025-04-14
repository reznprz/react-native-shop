const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// 1. Load the default config
const config = getDefaultConfig(__dirname);

// 2. Extend the transformer to use react-native-svg-transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

// 3. Adjust assetExts / sourceExts to handle .svg
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts.push("svg");

// 4. Wrap it with NativeWind
module.exports = withNativeWind(config, { input: "./global.css" });
