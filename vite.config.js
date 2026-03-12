import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/threejs-globe/' : '/',
  build: {
    rollupOptions: {
      external: ['react', 'react-dom/client', 'three', '@react-three/fiber', '@react-three/drei'],
      output: {
        manualChunks: undefined
      }
    }
  }
})
