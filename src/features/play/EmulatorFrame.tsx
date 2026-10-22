import type { Ref } from 'react'
import { EMULATOR_ORIGIN } from '@/config'

interface EmulatorFrameProps {
  /** File name of a game inside the emulator's `jar/` folder. Catalogue data only, never user input. */
  readonly jar: string
  readonly frameRef: Ref<HTMLIFrameElement>
  readonly state: string
  readonly title: string
  readonly className?: string | undefined
}

const SAFE_JAR = /^[a-z0-9-]+\.jar$/

/**
 * Embeds the emulator for one game. The emulator's `jar` parameter is not sanitized
 * upstream, so a name that is not plain catalogue-style is refused here too.
 */
export function EmulatorFrame({ jar, frameRef, state, title, className }: EmulatorFrameProps) {
  if (!SAFE_JAR.test(jar)) throw new Error(`Refusing unsafe jar name: ${jar}`)
  const src = `${EMULATOR_ORIGIN}/run.html?jar=${encodeURIComponent(jar)}`
  return (
    <iframe
      ref={frameRef}
      className={className}
      data-emulator-state={state}
      title={title}
      src={src}
      allow="autoplay; fullscreen"
    />
  )
}
