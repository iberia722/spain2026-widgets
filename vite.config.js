import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'briefing.html', dest: '.' },
        { src: 'dashboard.html', dest: '.' },
        { src: 'barcelona-map.html', dest: '.' },
        { src: 'barcelona-weather.html', dest: '.' },
        { src: 'barcelona-safety.html', dest: '.' },
        { src: 'madrid-weather.html', dest: '.' },
        { src: 'zaragoza-map.html', dest: '.' },
        { src: 'zaragoza-weather.html', dest: '.' },
      ]
    })
  ],
})
