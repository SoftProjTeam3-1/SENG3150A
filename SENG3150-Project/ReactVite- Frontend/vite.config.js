

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import istanbul from "vite-plugin-istanbul";

// eslint-disable-next-line no-undef
const useCoverage = !!process.env.CYPRESS_COVERAGE;

export default defineConfig({
  plugins: [
      react(),
      tailwind(),
      istanbul({
          cypress: true,
          requireEnv: false,
          include: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"],
          exclude: ["cypress/**/*", "node_modules/**/*"]
      })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
    },
  },
    define: {
        __COVERAGE__: useCoverage
    }
})
