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
        instruments: enInstruments,
        hero: enHero,
        investor: enInvestor,
      },
    },
    pl: {
      translation: {
        auth: plAuth,
        common: plCommon,
        instruments: plInstruments,
        hero: plHero,
        investor: plInvestor,
      },
    },
  },
});

export default i18n;
