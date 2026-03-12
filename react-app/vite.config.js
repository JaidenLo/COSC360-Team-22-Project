import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forward any /api requests to the backend on port 6000
      '/api': 'http://localhost:6000'
    }
  }
})
