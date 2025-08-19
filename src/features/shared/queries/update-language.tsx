import { type } from 'arktype';
import { httpRequest } from './http-request';
import i18n from '@/i18n/config';

export const syncLanguage = async () => {
  const { language } = i18n;
  await httpRequest({
    endpoint: '/api/investors/me/language/',
    method: 'POST',
    body: JSON.stringify({ language: language }),
    headers: {
      'Content-Type': 'application/json',
    },
    validator: type({
      language: 'string',
    }),
  });
};
