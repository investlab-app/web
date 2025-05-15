// @ts-check

import tseslint from 'typescript-eslint';
import pluginRouter from '@tanstack/eslint-plugin-router';
import pluginQuery from '@tanstack/eslint-plugin-query';

export default [
  ...tseslint.configs.recommended,
  ...pluginRouter.configs['flat/recommended'],
  ...pluginQuery.configs['flat/recommended'],
  {
    files: ['src/**/*', 'test/**/*'],
  },
];
