const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const os = require('os');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // Enable inline requires to improve startup time
    inlineRequires: true,
    // Minifier configuration for faster builds
    minifierConfig: {
      keep_classnames: true,
      keep_fnames: true,
      mangle: {
        keep_classnames: true,
        keep_fnames: true,
      },
    },
    // Increase timeout for transformer
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // Path alias resolution to match tsconfig.json paths
    extraNodeModules: {
      '@': path.resolve(__dirname, 'src'),
    },
    // Increase resolver timeout
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
    // Block all Android build directories from Metro file watcher
    blockList: [
      /android\/build\/.*/,
      /android\/app\/build\/.*/,
      /android\/\.gradle\/.*/,
      /android\/\.cxx\/.*/,
      /node_modules\/.*\/android\/build\/.*/,
      /node_modules\/.*\/android\/\.cxx\/.*/,
      /node_modules\/.*\/android\/\.gradle\/.*/,
    ],
  },
  // Increase max workers based on CPU cores (i5-8250U: 4 cores, 8 threads)
  maxWorkers: 8,
  // File-based caching for faster subsequent builds
  cacheStores: [
    new (require('metro-cache').FileStore)({
      root: path.join(os.tmpdir(), 'metro-cache'),
    }),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
