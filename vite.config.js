import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl', 'localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl', 'localhost.crt')),
    },
    port: 5173, // or your preferred port
  },
});
