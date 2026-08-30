import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native$': 'react-native-web',
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: false, // Desativa mapas de fonte em producao para evitar exposicao de codigo no navegador
  },
});
