import { useI18n } from '@/shared/i18n'
import styles from './HelpContent.module.css'

interface HelpContentProps {
  readonly titleId: string
  readonly padVisible: boolean
  readonly onPadVisibleChange: (visible: boolean) => void
}

/** The controls explained: keyboard map, soft keys, touch keys and the on-screen keys switch. */
export function HelpContent({ titleId, padVisible, onPadVisibleChange }: HelpContentProps) {
  const { t } = useI18n()
  return (
    <>
      <h2 id={titleId} className={styles.title}>
        {t.help.title}
      </h2>
      <h3 className={styles.heading}>{t.help.keyboard}</h3>
      <dl className={styles.rows}>
        {t.help.rows.map(([keys, action]) => (
          <div key={keys} className={styles.row}>
            <dt>
              <kbd>{keys}</kbd>
            </dt>
            <dd>{action}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.note}>{t.help.softKeys}</p>
      <h3 className={styles.heading}>{t.help.touch}</h3>
      <p className={styles.note}>{t.help.touchText}</p>
      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={padVisible}
          onChange={(event) => onPadVisibleChange(event.target.checked)}
        />
        {t.help.showPad}
      </label>
    </>
  )
}
