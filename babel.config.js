module.exports = function (api) {
  api.cache(true); // Enable Babel caching for performance

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }], // NativeWind preset
      "nativewind/babel", // NativeWind transformations
    ],
    plugins: [
      "react-native-worklets/plugin", // Required for react-native-reanimated
    ],
  };
};
