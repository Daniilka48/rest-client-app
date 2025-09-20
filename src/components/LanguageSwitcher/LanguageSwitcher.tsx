'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentLang(i18n.language || 'en');

    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  if (!isMounted) {
    return (
      <div className={styles.langBox}>
        <button
          className={styles.languageButton}
          onClick={() => changeLanguage('en')}
        >
          En
        </button>
        <button
          className={styles.languageButton}
          onClick={() => changeLanguage('ru')}
        >
          Ru
        </button>
      </div>
    );
  }

  return (
    <div className={styles.langBox}>
      <button
        className={`${styles.languageButton} ${
          currentLang === 'en' ? styles.activeLanguage : ''
        }`}
        onClick={() => changeLanguage('en')}
      >
        En
      </button>
      <button
        className={`${styles.languageButton} ${
          currentLang === 'ru' ? styles.activeLanguage : ''
        }`}
        onClick={() => changeLanguage('ru')}
      >
        Ru
      </button>
    </div>
  );
}
