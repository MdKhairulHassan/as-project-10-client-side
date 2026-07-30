import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // just for test to fix daisy ui
  // content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // plugins: [react(), tailwindcss(), require('daisyui')],
});
