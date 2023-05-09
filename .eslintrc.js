/** @type {import('eslint').Linter.Config} */

const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
  },
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
  ignorePatterns: ['node_modules/', '.next/', 'out/', 'build/', 'coverage/'],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/space-before-function-paren': ['off', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always',
    }],
    '@typescript-eslint/triple-slash-reference': ['off'],
  },
}

module.exports = config
