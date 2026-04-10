import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },

      // Assets to include in the precache
      includeAssets: ['favicon.png', 'icon.png', 'logo.png', 'og-image.svg'],

      // Web App Manifest
      manifest: {
        name: 'LandLord · Rent Transactions',
        short_name: 'LandLord',
        description:
          'Track rent payments, build your rental credit score, and visualise month-by-month coverage.',
        theme_color: '#031a60',
        background_color: '#031a60',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'en',
        categories: ['finance', 'productivity'],
        icons: [
          {
            src: 'pwa-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'pwa-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'og-image.svg',
            sizes: '1200x630',
            type: 'image/svg+xml',
            form_factor: 'wide',
            label: 'LandLord Dashboard',
          },
        ],
      },

      // Workbox service worker config
      workbox: {
        // Avoid Workbox terser renderChunk early-exit in this environment.
        mode: 'development',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          // Google Fonts — cache for 1 year
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // App pages — network first, fallback to cache
          {
            urlPattern: /^https:\/\/landlord\.aimelive\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-pages',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
