import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const fromHere = (path: string) => new URL(path, import.meta.url).pathname

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fromHere('./src'),
      // Spike: the protocol repo sits next to this one until it is published.
      'pixelito-protocol': fromHere('../pixelito-protocol/src/protocol.ts'),
    },
  },
  server: { fs: { allow: ['..'] } },
})
