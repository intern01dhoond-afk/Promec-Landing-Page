import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'next/link': path.resolve(__dirname, './lib/next-shim-link.tsx'),
      'next/image': path.resolve(__dirname, './lib/next-shim-image.tsx')
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
