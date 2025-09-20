'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    ns: ['common'],
    defaultNS: 'common',
    debug: false, // Disable debug to reduce console noise
    backend: {
      loadPath: '/api/locales/{{lng}}/{{ns}}',
      requestOptions: {
        cache: 'default',
      },
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'sessionStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false,
    },
    // Add this to handle loading failures more gracefully
    saveMissing: false,
    load: 'languageOnly',
  });

export default i18n;
