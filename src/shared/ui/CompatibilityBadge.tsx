import type { CompatibilityStatus } from '@/domain/game'
import { useI18n } from '@/shared/i18n'
import styles from './CompatibilityBadge.module.css'

/** A game's compatibility, always a color plus a word. */
export function CompatibilityBadge({ status }: { readonly status: CompatibilityStatus }) {
  const { t } = useI18n()
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {t.compatibility[status]}
    </span>
  )
}
