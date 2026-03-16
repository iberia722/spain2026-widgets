import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'index.html', dest: '.' },
        { src: 'briefing.html', dest: '.' },
        { src: 'dashboard.html', dest: '.' },
        { src: 'barcelona-map.html', dest: '.' },
        { src: 'barcelona-weather.html', dest: '.' },
        { src: 'barcelona-safety.html', dest: '.' },
        { src: 'madrid-weather.html', dest: '.' },
        { src: 'segovia-weather.html', dest: '.' },
        { src: 'zaragoza-map.html', dest: '.' },
        { src: 'zaragoza-weather.html', dest: '.' },
        { src: 'spain-social-feed.html', dest: '.' },
        { src: 'airport-advisory.html', dest: '.' },
        { src: 'airport-alerts-notion.html', dest: '.' },
        { src: 'airport-icon.html', dest: '.' },
      ]
    })
  ],
})
