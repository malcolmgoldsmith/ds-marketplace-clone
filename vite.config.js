import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: path.resolve(__dirname, 'app'),
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    port: 5173,
    strictPort: true,
    open: false
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'app/index.html'),
        settings: path.resolve(__dirname, 'app/settings.html'),
        'design-system': path.resolve(__dirname, 'app/design-system.html'),
        'black-friday-demo': path.resolve(__dirname, 'app/black-friday-demo.html')
      }
    }
  }
});
