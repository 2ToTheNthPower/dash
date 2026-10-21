import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const entry = fileURLToPath(new URL('./src/panel.tsx', import.meta.url))

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'custom_components/dash/frontend',
    emptyOutDir: true,
    target: 'es2022',
    lib: {
      entry,
      formats: ['es'],
      fileName: () => 'dash-panel.js',
    },
  },
})
