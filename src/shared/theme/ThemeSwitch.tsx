import { useI18n } from '@/shared/i18n'
import styles from './ThemeSwitch.module.css'
import { THEMES, useTheme } from './theme'

/** One swatch button per theme; the swatch previews the theme's own colours. */
export function ThemeSwitch() {
  const { t } = useI18n()
  const { theme, setTheme } = useTheme()
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{t.theme.label}</legend>
      {THEMES.map((option) => (
        <button
          key={option}
          type="button"
          data-theme={option}
          className={styles.option}
          aria-pressed={theme === option}
          aria-label={t.theme[option]}
          title={t.theme[option]}
          onClick={() => setTheme(option)}
        >
          <span className={styles.swatch} aria-hidden="true" />
        </button>
      ))}
    </fieldset>
  )
}
