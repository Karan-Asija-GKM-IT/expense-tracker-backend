import { FlatCompat } from "@eslint/eslintrc";


const compat = new FlatCompat({
  eslintVersion: "8.0.0",
});

export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-unused-vars": ["warn"],
    },
  },


  ...compat.extends("eslint:recommended"),
  ...compat.extends("plugin:react/recommended"),
  ...compat.extends("plugin:@typescript-eslint/recommended"),
];
