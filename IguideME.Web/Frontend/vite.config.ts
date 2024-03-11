import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  plugins: [react(), mkcert()],
  base: env.mode === "production" ? "/dist/" : "/",
  server: {
    https: true,
    port: 3000,
  },
  build: {
    outDir: path.resolve("..", "wwwroot", "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(__dirname, "src", "main.tsx"),
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
}));
