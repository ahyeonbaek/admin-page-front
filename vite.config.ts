import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
      },
      '/images': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/vworld': {
        target: 'https://api.vworld.kr', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vworld/, ''),
      },
    },
  },
})