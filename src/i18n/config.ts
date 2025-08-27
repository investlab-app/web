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
import enTransactions from './locales/en/transactions';
import plTransactions from './locales/pl/transactions';
import enStatistics from './locales/en/statistics';
import plStatistics from './locales/pl/statistics';
import enOrders from './locales/en/orders';
import plOrders from './locales/pl/orders';

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
        orders: enOrders,
        settings: enSettings,
        statistics: enStatistics,
        transactions: enTransactions,
      },
    },
    pl: {
      translation: {
        auth: plAuth,
        common: plCommon,
        hero: plHero,
        instruments: plInstruments,
        investor: plInvestor,
        orders: plOrders,
        settings: plSettings,
        statistics: plStatistics,
        transactions: plTransactions,
      },
    },
  },
});

export default i18n;
