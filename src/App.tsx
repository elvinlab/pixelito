import { PRODUCT_NAME } from '@/config'
import { EmulatorFrame } from '@/features/play'

/** Root component of the app shell. Placeholder until the library and play screens exist. */
export function App() {
  return (
    <main>
      <h1>{PRODUCT_NAME}</h1>
      <EmulatorFrame jar="game.jar" />
    </main>
  )
}
