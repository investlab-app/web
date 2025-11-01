import { investorsMePartialUpdate } from '@/client';
import i18n from '@/i18n/config';

export const syncLanguage = async () => {
  const { language } = i18n;
  await investorsMePartialUpdate({ body: { language } });
};
