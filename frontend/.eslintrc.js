/** @type {import('eslint').Linter.Config} */
module.exports = {
  // '@remix-run/eslint-config', '@remix-run/eslint-config/node',
  extends: ['standard-with-typescript'],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: ['node_modules/']
}
