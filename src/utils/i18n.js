import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { config } from '../config/index';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    backend: {
      loadPath: config.basePath + 'src/config/translations/{{lng}}', // Backend endpoint to fetch translations
    },
    detection: {
      order: ['localStorage', 'navigator'], // Use localStorage first, then browser language settings
      caches: ['localStorage'], // Cache the user's language preference in localStorage
    },
  });

export default i18n;
