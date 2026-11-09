import { useI18n } from '@/shared/i18n'
import { HelpContent } from './HelpContent'
import styles from './HelpPanel.module.css'

interface HelpPanelProps {
  readonly onClose: () => void
  readonly padVisible: boolean
  readonly onPadVisibleChange: (visible: boolean) => void
}

/** The controls beside the game on desktop. It never takes keys or focus from the game. */
export function HelpPanel({ onClose, padVisible, onPadVisibleChange }: HelpPanelProps) {
  const { t } = useI18n()
  return (
    <aside className={styles.panel} aria-labelledby="help-panel-title">
      <HelpContent
        titleId="help-panel-title"
        padVisible={padVisible}
        onPadVisibleChange={onPadVisibleChange}
      />
      <button type="button" className={styles.close} onClick={onClose}>
        {t.help.close}
      </button>
    </aside>
  )
}
