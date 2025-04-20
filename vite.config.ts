import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  plugins: [
    react(),
    inject({
      Buffer: ['buffer', 'Buffer'],
      // You can add process here too if needed
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'buffer': 'buffer',
    },
  },
});
