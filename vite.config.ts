import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function copyStaticAssets(): Plugin {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const copyDir = (src: string, dest: string) => {
        if (!fs.existsSync(src)) return;
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.cpSync(src, dest, { recursive: true, force: true });
        console.log(`[copy-static-assets] Copied folder ${src} -> ${dest}`);
      };

      const copyFile = (src: string, dest: string) => {
        if (!fs.existsSync(src)) return;
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.copyFileSync(src, dest);
        console.log(`[copy-static-assets] Copied file ${src} -> ${dest}`);
      };

      copyDir('vendor', 'dist/vendor');
      copyDir('assets', 'dist/assets');
      copyFile('slater-custom.js', 'dist/slater-custom.js');
      copyFile('main.js', 'dist/main.js');
      copyFile('promec-logo.svg', 'dist/promec-logo.svg');
      copyFile('favicon.ico', 'dist/favicon.ico');
      copyFile('slater-custom.css', 'dist/slater-custom.css');
      copyFile('custom-enhancements.css', 'dist/custom-enhancements.css');
      copyFile('webflow-core.css', 'dist/webflow-core.css');
    }
  };
}

export default defineConfig({
  plugins: [react(), copyStaticAssets()],
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
