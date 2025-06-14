import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      api: resolve(__dirname, './src/api'),
      components: resolve(__dirname, './src/components'),
      contexts: resolve(__dirname, './src/contexts'),
      hooks: resolve(__dirname, './src/hooks'),
      store: resolve(__dirname, './src/store'),
      views: resolve(__dirname, './src/views')
    }
  },
  esbuild: {
    // Esto ayuda a ignorar errores de tipos durante la compilación
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
