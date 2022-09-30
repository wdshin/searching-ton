const common = require("@blitzjs/next/eslint")
common.overrides =  [
    {
      files: ["**/*.ts?(x)"],
      plugins: ["@typescript-eslint"],
      parserOptions: {
        project: "./tsconfig.json",
      },
      rules: {
        "@typescript-eslint/no-floating-promises": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["off"],
        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": ["error"],
        "react/display-name": "off",
      },
    },
  ],
module.exports = common;
// @typescript-eslint/no-floating-promises