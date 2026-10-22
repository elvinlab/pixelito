import { useI18n } from './I18nProvider'
import styles from './LanguageSwitch.module.css'
import { LOCALES } from './locale'

/** Two buttons that switch the interface language. */
export function LanguageSwitch() {
  const { locale, t, setLocale } = useI18n()
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{t.language.label}</legend>
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          className={styles.option}
          aria-pressed={locale === option}
          onClick={() => setLocale(option)}
        >
          {option.toUpperCase()}
          <span className={styles.name}> {t.language[option]}</span>
        </button>
      ))}
    </fieldset>
  )
}
