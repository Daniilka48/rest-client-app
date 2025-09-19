'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'], // Supported languages
    ns: ['common'], // Namespaces for translation files
    defaultNS: 'common', // Default namespace
    debug: false, // Set true to see debug logs during development
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'], // Detect language from these sources
      caches: ['cookie', 'localStorage'], // Cache language detection
    },
  });

export default i18n;
