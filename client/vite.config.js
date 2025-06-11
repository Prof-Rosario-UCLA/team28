import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';
import fs from 'fs';

const isDocker = process.env.VITE_DOCKER === 'true';

export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',     
      includeAssets: [
        'favicon.ico',
        'icon192.png',
        'icon512.png',
        'defaultProfile.jpg'
      ],
      manifest: {   
        name: "RoomieMatch",
        short_name: "RoomieMatch",
        description: "Find your perfect roommate",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#1f2937",
        theme_color: "#1f2937",
        categories: ["productivity", "utilities"],
        icons: [
          {
            "src": "/icon192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/icon512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
      },
      devOptions: {
        enabled: true,    // enable SW in npm run dev
        type: 'module'
      }
    })
  ],
  
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: isDocker ? 'http://server:3000' : 'http://localhost:3000',
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
        target: isDocker ? 'http://server:3000' : 'http://localhost:3000', //cahgne to https? 'https://d716-2607-f010-2a7-301e-84d1-58b6-b168-3955.ngrok-free.app'
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
