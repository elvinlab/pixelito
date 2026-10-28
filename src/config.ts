export { PRODUCT_NAME } from './product'

/**
 * Origin of the emulator. It must differ from the app's origin: the emulator
 * needs its own real origin, and an opaque-origin sandbox does not work.
 */
export const EMULATOR_ORIGIN = import.meta.env.VITE_EMULATOR_ORIGIN ?? 'http://127.0.0.1:5174'
