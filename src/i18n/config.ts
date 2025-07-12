import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';
import enAuth from './locales/en/auth';
import plAuth from './locales/pl/auth';
import enCommon from './locales/en/common';
import plCommon from './locales/pl/common';
import enInstruments from './locales/en/instruments';
import plInstruments from './locales/pl/instruments';
import enHero from './locales/en/hero';
import plHero from './locales/pl/hero';
import enInvestor from './locales/en/investor';
import plInvestor from './locales/pl/investor';
import enSettings from './locales/en/settings';
import plSettings from './locales/pl/settings';

const browserLanguage = navigator.language;
const defaultLanguage = browserLanguage.split('-')[0];

i18n.use(initReactI18next).init({
  lng: defaultLanguage,
  fallbackLng: 'en',
  debug: import.meta.env.DEV,

  interpolation: {
    escapeValue: false,
  },

  resources: {
    en: {
      translation: {
        auth: enAuth,
        common: enCommon,
        hero: enHero,
        instruments: enInstruments,
        investor: enInvestor,
        settings: enSettings,
      },
    },
    pl: {
      translation: {
        auth: plAuth,
        common: plCommon,
        hero: plHero,
        instruments: plInstruments,
        investor: plInvestor,
        settings: plSettings,
      },
    },
  },
});

export default i18n;
