import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: './public',
  build: {
    outDir: 'dist',
  },
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false,
            },
          ],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
      './runtimeConfig': './runtimeConfig.browser',
      restrictions: path.resolve(__dirname, 'src/app/restrictions'),
      actions: path.resolve(__dirname, 'src/app/actions'),
      api: path.resolve(__dirname, 'src/app/api'),
      components: path.resolve(__dirname, 'src/app/components'),
      helpers: path.resolve(__dirname, 'src/app/helpers'),
      hooks: path.resolve(__dirname, 'src/app/hooks'),
      img: path.resolve(__dirname, 'src/app/img'),
      reducers: path.resolve(__dirname, 'src/app/reducers'),
      views: path.resolve(__dirname, 'src/app/views'),
      styles: path.resolve(__dirname, 'src/app/styles'),
      modal: path.resolve(__dirname, 'src/app/modal'),
      selectors: path.resolve(__dirname, 'src/app/selectors'),
      alert: path.resolve(__dirname, 'src/app/alert'),
      sagas: path.resolve(__dirname, 'src/app/sagas'),
      routing: path.resolve(__dirname, 'src/app/routing'),
      location: path.resolve(__dirname, 'src/app/location'),
      'context-api': path.resolve(__dirname, 'src/app/context-api'),
      'ui-toolkit': path.resolve(__dirname, 'src/app/ui-toolkit'),
    },
  },
});
