/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the emulator, for example `http://127.0.0.1:5174`; a path is allowed. */
  readonly VITE_EMULATOR_URL?: string
  readonly VITE_EMULATOR_ORIGIN?: string
}
