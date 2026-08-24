import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {},
  },
  server: {port: 5173},
  test: {
    environment: 'happy-dom',
  },
});

