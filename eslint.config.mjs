// @ts-check
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import youMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import pluginRouter from '@tanstack/eslint-plugin-router';
import pluginQuery from '@tanstack/eslint-plugin-query';
import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tseslint.configs.recommended,
  ...tanstackConfig,
  ...pluginRouter.configs['flat/recommended'],
  ...pluginQuery.configs['flat/recommended'],
  youMightNotNeedAnEffect.configs.recommended,
  reactHooks.configs['recommended-latest'],
  {
    rules: {
      'pnpm/json-enforce-catalog': 'off',
    },
  },
];
