import { defineConfig } from 'vite';

// keeping this really simple on purpose.
// the proxy lets the browser call the APIs through Vite during local dev.
// that helps avoid browser CORS issues.
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api/nvd': {
        target: 'https://services.nvd.nist.gov/rest/json',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nvd/, '')
      },
      '/api/circl': {
        target: 'https://cve.circl.lu',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/circl/, '')
      }
    }
  }
});
