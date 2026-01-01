import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import tailwind from "eslint-plugin-tailwindcss";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist", "build", "eslint.config.js"] },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ...tseslint.configs.recommended,
  ...tailwind.configs["flat/recommended"],
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    files: ["./src/**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin.flatConfigs.recommended.plugins.import,
    },
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: true,
      },
      "import/core-modules": ["obsidian"],
      tailwindcss: {
        callees: ["classnames", "clsx", "ctl", "cn", "cva"],
        config: "./tailwind.config.js", // Use the root config which extends with custom colors
        cssFiles: [
          "**/*.css",
          "!**/node_modules",
          "!**/.*",
          "!**/dist",
          "!**/build",
        ],
        cssFilesRefreshRate: 5_000,
        removeDuplicates: true,
        skipClassAttribute: false,
        whitelist: [
          "@container",
          "fas",
          "fa",
          "fa\\-.+:?.+",
          "u",
          "u\\-.+:?.+",
          "z\\-.+:?.+",
          "errors",
          "active",
        ],
        tags: [],
        classRegex: "^class(Name)?$",
      },
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react/prop-types": "off",
      "import/no-unresolved": ["error", { ignore: ["obsidian"] }],
      "import/no-cycle": "error",
      "tailwindcss/no-custom-classname": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "tailwindcss/classnames-order": "off",
      "@typescript-eslint/no-empty-object-type": "warn",
      allowInterfaces: "off",
    },
  },
];
