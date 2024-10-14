/* eslint-disable import-x/no-unresolved */
import js from "@eslint/js";
import superReact from "@eslint-react/eslint-plugin";
import * as tsParser from "@typescript-eslint/parser";
import importX from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import refresh from "eslint-plugin-react-refresh";
import tailwindcss from "eslint-plugin-tailwindcss";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  importX.flatConfigs.recommended,
  {
    files: [
      "eslint.config.js",
      "postcss.config.js",
      "tailwind.config.js",
      "vite.config.js",
    ],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.node, ...globals.es2023 },
    },
    rules: {
      "no-shadow": "warn",
      "sort-imports": ["warn", { ignoreDeclarationSort: true }],
      "no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "import-x/order": [
        "warn",
        {
          groups: ["builtin", "external", "parent", "sibling", "index"],
          alphabetize: { order: "asc" },
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.es2020 },
      parserOptions: {
        jsxPragma: null,
        parser: tsParser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "react": react,
      "react-hooks": reactHooks,
      "react-refresh": refresh,
      "tailwindcss": tailwindcss,
      "jsx-a11y": jsxA11y,
      ...superReact.configs.recommended.plugins,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...tailwindcss.configs["flat/recommended"][1].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      ...superReact.configs.recommended.rules,
      ...importX.flatConfigs.typescript.rules,
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-import-type-side-effects": "warn",
      "sort-imports": ["warn", { ignoreDeclarationSort: true }],
      "react/self-closing-comp": "warn",
      "react/jsx-no-leaked-render": "warn",
      "react/jsx-no-useless-fragment": "warn",
      "react-refresh/only-export-components": "warn",
      "import-x/consistent-type-specifier-style": ["warn", "prefer-top-level"],
      "react/jsx-sort-props": [
        "warn",
        {
          shorthandLast: true,
          multiline: "last",
          reservedFirst: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "import-x/order": [
        "warn",
        {
          groups: ["builtin", "external", "parent", "sibling", "index", "type"],
          alphabetize: { order: "asc" },
        },
      ],
    },
    settings: {
      ...superReact.configs.recommended.settings,
      ...importX.flatConfigs.typescript.settings,
      react: {
        version: "detect",
      },
      tailwindcss: {
        callees: ["twMerge", "cva"],
      },
    },
  },
);
