import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://trentxn.github.io/millenia-website/ on GitHub Pages
  base: '/millenia-website/',
  plugins: [react(), tailwindcss()],
})
