import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/workout/', // GitHub Pages base path
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
  },
  assetsInclude: ['**/*.json'],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
})
