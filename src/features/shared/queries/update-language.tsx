import i18n from '@/i18n/config';
import { investorsMeLanguageCreate } from '@/client/sdk.gen';
import { zLanguageEnum } from '@/client/zod.gen';

export const syncLanguage = async () => {
  const { language } = i18n;
  const parsed = zLanguageEnum.safeParse(language);
  if (!parsed.success) {
    console.warn(`Unsupported language code: ${language}`);
    return;
  }
  await investorsMeLanguageCreate({
    body: { language: parsed.data },
  });
};
