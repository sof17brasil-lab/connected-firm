import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

/**
 * GitHub Pages has no SPA rewrite, so a direct hit on /sources would 404.
 * Serving the same HTML as 404.html lets React Router pick the route up.
 */
function pagesSpaFallback(): Plugin {
  return {
    name: 'pages-spa-fallback',
    closeBundle() {
      const out = path.resolve(import.meta.dirname, 'dist')
      const index = path.join(out, 'index.html')
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.join(out, '404.html'))
      }
    },
  }
}

export default defineConfig({
  // GitHub Pages serves the site from /connected-firm/, so every asset URL
  // needs that prefix. Vite exposes it to the app as import.meta.env.BASE_URL.
  base: '/connected-firm/',
  plugins: [react(), tailwindcss(), pagesSpaFallback()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: { port: 5173, strictPort: true },
})
