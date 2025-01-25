import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000, // Use the PORT variable if available, else 3000
    host: '0.0.0.0', // Listen on all interfaces
  },
}));