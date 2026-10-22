/**
 * Product name shown to users.
 *
 * It lives here only, so a rename is a one-line change.
 */
export const PRODUCT_NAME = 'Pixelito'

/**
 * Origin of the emulator. It must differ from the app's origin: the emulator
 * needs its own real origin, and an opaque-origin sandbox does not work.
 */
export const EMULATOR_ORIGIN = import.meta.env.VITE_EMULATOR_ORIGIN ?? 'http://127.0.0.1:5174'
