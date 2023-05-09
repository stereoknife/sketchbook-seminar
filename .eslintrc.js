module.exports = {
  extends: ['next/core-web-vitals', 'plugin:storybook/recommended'],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: ['node_modules/']
};