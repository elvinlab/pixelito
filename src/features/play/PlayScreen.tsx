import { useEffect, useRef } from 'react'
import { LIBRARY_HREF } from '@/app/router'
import type { Game } from '@/domain/game'
import { useI18n } from '@/shared/i18n'
import { EmulatorFrame } from './EmulatorFrame'
import { Keypad } from './Keypad'
import { isForwardedKey } from './keys'
import styles from './PlayScreen.module.css'
import { useEmulatorBridge } from './useEmulatorBridge'

/** The play screen: back link, title, the emulator and Pixelito's own keys. */
export function PlayScreen({ game }: { readonly game: Game }) {
  const { t } = useI18n()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const { state, sendKey } = useEmulatorBridge(frameRef)

  useEffect(() => {
    const forward = (action: 'down' | 'up') => (event: KeyboardEvent) => {
      if (event.repeat || !isForwardedKey(event.code)) return
      event.preventDefault()
      sendKey(action, event.code)
    }
    const onDown = forward('down')
    const onUp = forward('up')
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [sendKey])

  return (
    <div className={styles.screen}>
      <header className={styles.bar}>
        <a className={styles.back} href={LIBRARY_HREF}>
          {t.play.back}
        </a>
        <h1 className={styles.title}>{game.title}</h1>
      </header>
      <div className={styles.stage}>
        <EmulatorFrame
          className={styles.frame}
          frameRef={frameRef}
          state={state}
          title={t.play.screen}
          jar={game.emulatorJar}
        />
        {state !== 'started' && <p className={styles.status}>{t.play.loading}</p>}
      </div>
      <Keypad onKey={sendKey} />
    </div>
  )
}
