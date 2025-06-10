import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',        // index-Df5YnbyD.js → index.js
        assetFileNames: 'assets/[name].[ext]'     // index-Bvs2vMK4.css → index.css
                                                  // favicon-BDl8vBE1.ico → favicon.ico
      }
    }
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', //cahgne to https? 'https://d716-2607-f010-2a7-301e-84d1-58b6-b168-3955.ngrok-free.app'
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
