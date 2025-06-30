// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      // 첫 번째 백엔드
      '/api': {
        target: 'http://34.64.91.165:8082',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api')
      },
      // 두 번째 백엔드
      '/api1': {
        target: 'http://172.16.0.190:8888',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api1/, '/api')
      }
    }
  }
});
