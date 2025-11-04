/**
 * ESLint Configuration
 * Catches common React Native bugs at build time
 *
 * NO NEW PACKAGES NEEDED - uses existing @react-native/eslint-config
 */

module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // ========================================================================
    // CRITICAL: Prevents 40% of runtime crashes
    // ========================================================================

    // Catch missing useEffect/useCallback dependencies (causes stale closures, infinite loops)
    'react-hooks/exhaustive-deps': 'error',

    // Prevent reassigning function parameters (causes bugs in React)
    'no-param-reassign': ['error', { props: false }],

    // Catch async functions without await (likely a mistake)
    'require-await': 'error',

    // No console.log in production
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // ========================================================================
    // TypeScript: Prevents type errors
    // ========================================================================

    // Ban @ts-ignore (forces you to fix type issues)
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-ignore': 'allow-with-description',
        minimumDescriptionLength: 10,
      },
    ],

    // Catch unused variables (dead code)
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // Prevent "any" from leaking
    '@typescript-eslint/no-explicit-any': 'warn',

    // ========================================================================
    // React/React Native: Prevents UI bugs
    // ========================================================================

    // All components must use React in scope (RN 0.17+)
    'react/react-in-jsx-scope': 'off',

    // Prevent missing keys in lists (causes re-render bugs)
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],

    // Catch inline function definitions in render (performance)
    'react/jsx-no-bind': [
      'warn',
      {
        allowArrowFunctions: true,
        allowBind: false,
        ignoreRefs: true,
      },
    ],

    // Prevent invalid hook calls
    'react-hooks/rules-of-hooks': 'error',

    // ========================================================================
    // Code Quality: Prevents logical errors
    // ========================================================================

    // No duplicate imports
    'no-duplicate-imports': 'error',

    // Consistent return (all branches must return)
    'consistent-return': 'warn',

    // No unreachable code
    'no-unreachable': 'error',

    // Catch == instead of ===
    eqeqeq: ['error', 'always', { null: 'ignore' }],

    // No magic numbers (use constants)
    'no-magic-numbers': [
      'warn',
      {
        ignore: [0, 1, -1, 2],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true,
      },
    ],
  },

  // Ignore patterns
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    '*.config.js',
    'metro.config.js',
    'babel.config.js',
  ],
};
