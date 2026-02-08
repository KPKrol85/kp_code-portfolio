module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  ignorePatterns: ["js/app.min.js", "node_modules/", "playwright-report/", "test-results/"],
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-undef": "error",
    eqeqeq: ["error", "always"],
    "no-useless-catch": "off"
  }
};
