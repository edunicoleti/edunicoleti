import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    // Respeita a porta atribuída pelo ambiente (ex.: preview do Claude Code)
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  build: {
    outDir: 'dist',
  },
})
