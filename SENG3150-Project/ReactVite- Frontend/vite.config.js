import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080', // Forward API requests to Spring Boot backend
    },
    host: '0.0.0.0', // Allow network access
    port: 5173,      // The port you're using
  },
});