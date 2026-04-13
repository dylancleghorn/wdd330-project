import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api/nvd': {
        target: 'https://services.nvd.nist.gov/rest/json',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nvd/, '')
      },
      '/api/epss': {
        target: 'https://api.first.org/data/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/epss/, '')
      }
    }
  }
});
