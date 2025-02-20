import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  plugins: [react(), mkcert()],
  base: env.mode === 'production' ? '/dist/' : '/front',
  server: {
    https: true,
    port: 3000,
  },
  build: {
    outDir: path.resolve('..', 'wwwroot', 'dist'),
    emptyOutDir: true,
    rollupOptions: {},
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
}));
