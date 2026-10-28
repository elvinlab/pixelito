import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { PRODUCT_NAME } from './src/product'

/** Emits the web app manifest, so the product name is read from one place. */
const manifest = (): Plugin => ({
  name: 'pixelito-manifest',
  generateBundle() {
    const icon = (size: number, purpose: string) => ({
      src: `icon-${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose,
    })
    this.emitFile({
      type: 'asset',
      fileName: 'manifest.webmanifest',
      source: JSON.stringify({
        name: PRODUCT_NAME,
        short_name: PRODUCT_NAME,
        start_url: './',
        display: 'standalone',
        background_color: '#07070f',
        theme_color: '#07070f',
        icons: [icon(192, 'any'), icon(512, 'any'), icon(512, 'maskable')],
      }),
    })
  },
})

const fromHere = (path: string) => new URL(path, import.meta.url).pathname

export default defineConfig(({ mode }) => ({
  // Served from a sub-path on GitHub Pages; the workflow sets VITE_BASE.
  base: loadEnv(mode, '.', 'VITE_').VITE_BASE ?? '/',
  plugins: [react(), manifest()],
  resolve: {
    alias: {
      '@': fromHere('./src'),
      // The package ships TypeScript source only, so point at it directly.
      'pixelito-protocol': fromHere('./node_modules/pixelito-protocol/src/protocol.ts'),
    },
  },
}))
