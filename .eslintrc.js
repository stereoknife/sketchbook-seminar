/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals'
  ],
  ignorePatterns: ['node_modules/', '.next/', 'out/', 'build/'],
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    '@typescript-eslint/no-empty-interface': ['error', {allowSingleExtends: true}]
  }
}

module.exports = config
