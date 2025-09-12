// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('[proxy] →', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('[proxy] ←', proxyRes.statusCode, req.method, req.url)
          })
          proxy.on('error', (err, req) => {
            console.error('[proxy] error', req.method, req.url, err.message)
          })
        },
      },
    },
  },
})