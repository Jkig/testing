import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pages from 'vite-plugin-pages';

export default defineConfig({
  plugins: [react(), pages()],
  build: {
    rollupOptions: {
      input: {
        main: './public/index.html',
        view: './public/view.html',
      },
    },
  },
});
