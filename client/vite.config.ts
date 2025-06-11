import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
console.log('vite config loaded') 
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://server:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
