import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Pet Feeder',
        short_name: 'Feeder',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0084ff',
        icons: [
          {
            src: './Pet_feeder.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './Pet_feeder.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
