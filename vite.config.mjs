import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  optimizeDeps: {
    // Agentation is loaded only after the app renders in development.
    exclude: ['agentation']
  },
  server: {
    port: 5173
  }
});
