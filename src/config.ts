export { PRODUCT_NAME } from './product'

/**
 * Base URL of the emulator, with an optional path (a GitHub Pages project site lives under
 * one). `VITE_EMULATOR_ORIGIN` is the older name of the same setting.
 */
export const EMULATOR_URL = (
  import.meta.env.VITE_EMULATOR_URL ??
  import.meta.env.VITE_EMULATOR_ORIGIN ??
  'http://127.0.0.1:5174'
).replace(/\/+$/, '')

/**
 * Origin of the emulator, the part messages are checked against. It must differ from the
 * app's origin: the emulator needs its own real origin, and an opaque-origin sandbox does
 * not work.
 */
export const EMULATOR_ORIGIN = new URL(EMULATOR_URL).origin
