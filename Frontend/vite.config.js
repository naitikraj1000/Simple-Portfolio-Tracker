import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173, 
    host: '0.0.0.0', // Listen on all interfaces
  },
}));


