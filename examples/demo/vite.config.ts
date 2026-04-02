import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/demo/',
  build: {
    outDir: '../../stratoadmin.dev/static/demo',
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@strato-admin/admin': path.resolve(__dirname, '../../packages/strato-admin/src'),
      '@strato-admin/cloudscape': path.resolve(__dirname, '../../packages/strato-cloudscape/src'),
      '@strato-admin/core': path.resolve(__dirname, '../../packages/strato-core/src'),
      '@strato-admin/faker-ecommerce': path.resolve(__dirname, '../../packages/strato-faker-ecommerce/src'),
      '@strato-admin/i18n': path.resolve(__dirname, '../../packages/strato-i18n/src'),
      '@strato-admin/language-en': path.resolve(__dirname, '../../packages/strato-language-en/src'),
      '@strato-admin/language-fr': path.resolve(__dirname, '../../packages/strato-language-fr/src'),
    },
  },
});
