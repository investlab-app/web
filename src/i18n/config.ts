import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';
import enAuth from './locales/en/auth';
import plAuth from './locales/pl/auth';
import enCommon from './locales/en/common';
import plCommon from './locales/pl/common';

i18n.use(initReactI18next).init({
  lng: 'pl',
  fallbackLng: 'en',
  debug: true,

  interpolation: {
    escapeValue: false,
  },

  resources: {
    en: {
      translation: {
        auth: enAuth,
        common: enCommon,
      },
    },
    pl: {
      translation: {
        auth: plAuth,
        common: plCommon,
      },
    },
  },
});

export default i18n;
