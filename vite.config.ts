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
  // Ensure package.json can be imported
  define: {
    // Optional: you can also expose version as a global variable
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})
