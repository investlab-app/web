import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    VitePWA({
      srcDir: 'src',
      filename: 'sw.ts',
      strategies: 'injectManifest',
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        name: 'InvestLab',
        short_name: 'InvestLab',
        description: 'Paper trading',
        theme_color: '#8640ef',
        background_color: '#0a0a0a',
        display: 'standalone',
        icons: [
          {
            src: 'icons/logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      injectManifest: {
        globDirectory: 'dist',
        globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('/node_modules/echarts/') ||
            id.includes('/node_modules/zrender/')
          ) {
            return 'echarts';
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
  },
});
