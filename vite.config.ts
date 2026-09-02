import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // required for Electron: assets must resolve via relative paths, not root-absolute
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    strictPort: true, // fail fast instead of silently picking another port (breaks wait-on)
  },
});
