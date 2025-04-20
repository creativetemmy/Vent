
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import inject from '@rollup/plugin-inject';
// Import componentTagger from lovable-tagger for Lovable projects
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    inject({
      Buffer: ['buffer', 'Buffer'],
      // You can add process here too if needed
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'buffer': 'buffer',
    },
  },
}));
