/** @type {import('eslint').Linter.Config} */

const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'standard-with-typescript',
    'next/core-web-vitals',
    'plugin:storybook/recommended',
  ],
  ignorePatterns: ['node_modules/', '.next/', 'out/', 'build/'],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
  },
}

module.exports = config
