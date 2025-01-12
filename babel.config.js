module.exports = function (api) {
  api.cache(true); // Enable Babel caching for performance

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }], // NativeWind preset
      "nativewind/babel", // NativeWind transformations
    ],
    plugins: [
      "react-native-reanimated/plugin", // Required for react-native-reanimated
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env", // Use @env for importing environment variables
          path: ".env", // Path to your environment files
          allowUndefined: false, // Throw errors for undefined variables
        },
      ],
    ],
  };
};
