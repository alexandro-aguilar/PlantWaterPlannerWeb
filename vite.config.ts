import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/plant-water-planner-bucket': 'http://localhost:4566', // Proxy requests starting with /api to your backend
    },
  },
  plugins: [react()],
})