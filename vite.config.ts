import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/plant-water-planner-bucket': {
        target: 'http://localhost:4566',
        changeOrigin: true,
        secure: false, // LocalStack uses HTTP
        // rewrite: (path) => path.replace(/^\/proxy/, ""),
      },
    },
  },
  plugins: [react()],
})
