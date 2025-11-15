import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: '../backend/src/schema.yml',
  output: {
    path: 'src/client',
  },
  plugins: [
    '@tanstack/react-query',
    {
      name: 'zod',
      dates: {
        offset: true,
      },
    },
    {
      name: '@hey-api/sdk',
      validator: true,
    },
  ],
});
