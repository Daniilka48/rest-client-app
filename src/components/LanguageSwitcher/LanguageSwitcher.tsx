'use client';

import i18n from 'i18next';
import styles from './LanguageSwitcher.module.css';
export default function LanguageSwitcher() {
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className={styles.langBox}>
      <button
        className={`${styles.languageButton} ${
          i18n.language === 'en' ? styles.activeLanguage : ''
        }`}
        onClick={() => changeLanguage('en')}
      >
        En
      </button>
      <button
        className={`${styles.languageButton} ${
          i18n.language === 'ru' ? styles.activeLanguage : ''
        }`}
        onClick={() => changeLanguage('ru')}
      >
        Ru
      </button>
    </div>
  );
}
