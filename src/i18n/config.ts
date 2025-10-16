import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
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
import enFaq from './locales/en/legal/faq';
import plFaq from './locales/pl/legal/faq';
import plPrivacyPolicy from './locales/pl/legal/privacy-policy';
import plTermsOfService from './locales/pl/legal/terms-of-service';
import enPrivacyPolicy from './locales/en/legal/privacy-policy';
import enTermsOfService from './locales/en/legal/terms-of-service';
import enFlows from './locales/en/flows';
import plFlows from './locales/pl/flows';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,

    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage'],
      convertDetectedLanguage: (lang) => lang.split('-')[0],
    },

    interpolation: {
      format: (value, _format, lng) => {
        if (value instanceof Date) {
          return new Intl.DateTimeFormat(lng, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(value);
        }
        return value;
      },
    },

    resources: {
      en: {
        translation: {
          auth: enAuth,
          common: enCommon,
          flows: enFlows,
          hero: enHero,
          instruments: enInstruments,
          investor: enInvestor,
          orders: enOrders,
          settings: enSettings,
          statistics: enStatistics,
          transactions: enTransactions,
          legal: {
            faq: enFaq,
            privacyPolicy: enPrivacyPolicy,
            termsOfService: enTermsOfService,
          },
        },
      },
      pl: {
        translation: {
          auth: plAuth,
          common: plCommon,
          flows: plFlows,
          hero: plHero,
          instruments: plInstruments,
          investor: plInvestor,
          orders: plOrders,
          settings: plSettings,
          statistics: plStatistics,
          transactions: plTransactions,
          legal: {
            faq: plFaq,
            privacyPolicy: plPrivacyPolicy,
            termsOfService: plTermsOfService,
          },
        },
      },
    },
  });

export default i18n;
