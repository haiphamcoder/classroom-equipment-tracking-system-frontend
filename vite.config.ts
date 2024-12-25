import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/classroom-equipment-tracking-system-frontend',
  plugins: [react()],
  server: {
    proxy: {
      "/api": { // Add leading slash
        target: "http://34.111.204.86/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '') // Optional: Remove /api prefix if backend doesn't expect it
      }
    }
  }
});
