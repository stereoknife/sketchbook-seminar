module.exports = {
  extends: ['next/core-web-vitals'/*, 'standard-with-typescript' */],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: ['node_modules/']
}
