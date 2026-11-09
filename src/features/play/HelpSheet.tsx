import { useEffect, useRef } from 'react'
import { useI18n } from '@/shared/i18n'
import { HelpContent } from './HelpContent'
import styles from './HelpSheet.module.css'

interface HelpSheetProps {
  readonly onClose: () => void
  readonly padVisible: boolean
  readonly onPadVisibleChange: (visible: boolean) => void
}

/** A sheet over the game that explains the keys. Escape and the close button dismiss it. */
export function HelpSheet({ onClose, padVisible, onPadVisibleChange }: HelpSheetProps) {
  const { t } = useI18n()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onClose()
    }
    // The emulator frame grabs focus by itself; take it back so Escape reaches this sheet, not the game.
    const takeFocusBack = () => closeRef.current?.focus()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('blur', takeFocusBack)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('blur', takeFocusBack)
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [onClose])

  return (
    <div className={styles.backdrop}>
      <section
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
      >
        <HelpContent
          titleId="help-title"
          padVisible={padVisible}
          onPadVisibleChange={onPadVisibleChange}
        />
        <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
          {t.help.close}
        </button>
      </section>
    </div>
  )
}
