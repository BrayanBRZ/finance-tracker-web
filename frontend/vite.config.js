import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { securityPolicyPlugin } from './security.config.js'

export default defineConfig(({ mode, command, isPreview }) => {
  const env = loadEnv(
    mode,
    fileURLToPath(new URL('.', import.meta.url)),
    'VITE_',
  )
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        strategies: 'generateSW',
        injectRegister: 'script-defer',
        manifestFilename: 'manifest.json',
        manifest: {
          id: '/',
          name: 'Finance Tracker',
          short_name: 'Finance Tracker',
          description: 'Controle suas finanças pessoais e compartilhadas.',
          lang: 'pt-BR',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          theme_color: '#17315f',
          background_color: '#ffffff',
          icons: [
            { src: '/icons/app-192.png', sizes: '192x192', type: 'image/png' },
            {
              src: '/icons/app-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: [
            '**/*.{html,js,css,svg,png,woff,woff2,ttf}',
            'manifest.json',
          ],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api(?:\/|\?|$)/],
          // Only precache build assets. API responses stay on the network.
          runtimeCaching: [],
        },
      }),
      ...(command === 'build' || isPreview
        ? [securityPolicyPlugin(env.VITE_API_URL)]
        : []),
    ],
    build: {
      // Keep fonts as same-origin files so CSP allows them and the worker can cache them.
      assetsInlineLimit: 0,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
