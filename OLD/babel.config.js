module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Commented out: react-native-dotenv not installed (using env.config.ts instead)
    // [
    //   'module:react-native-dotenv',
    //   {
    //     moduleName: '@env',
    //     path: '.env',
    //     safe: false,
    //     allowUndefined: true,
    //   },
    // ],
    'react-native-reanimated/plugin',
  ],
};
