import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Desarrollo: base '/'. Producción GitHub Pages: npm run build:pages
export default defineConfig({
  plugins: [react()],
  base: '/',
})
