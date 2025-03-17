import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // Ensures Vite correctly serves assets
  plugins: [react()],
});
