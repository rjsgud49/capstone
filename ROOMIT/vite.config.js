// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      '/api': 'http://172.28.2.18:8082/', //백엔드 서버 주소
      // '/api': 'http://192.168.244.44:8082/',
    },
  },
});
  