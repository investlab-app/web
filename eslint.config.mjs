// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginRouter from "@tanstack/eslint-plugin-router";

export default [
  ...tseslint.config(eslint.configs.recommended, tseslint.configs.recommended),
  ...pluginRouter.configs["flat/recommended"],
  {
    files: ["src/**/*", "__test__/**/*"],
  },
];
