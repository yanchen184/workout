import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const base = command === 'build' ? '/workout/' : '/'; // Only use /workout/ for production build
  
  return {
    plugins: [react()],
    base,
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
  };
});
