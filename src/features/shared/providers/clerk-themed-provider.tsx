import { ClerkProvider } from '@clerk/tanstack-react-start';
import { dark } from '@clerk/themes';
import { enUS, plPL } from '@clerk/localizations';
import { useTranslation } from 'react-i18next';
import { match } from 'arktype';
import type { ReactNode } from 'react';
import { useTheme } from '@/features/shared/components/theme-provider.tsx';

const languageMatcher = match.in<string>().match({
  "'pl'": () => plPL,
  "'en'": () => enUS,
  default: (lang) => {
    console.error(`Unsupported language: ${lang}. Defaulting to 'en'`);
    return enUS;
  },
});

export function ClerkThemedProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const localization = languageMatcher(i18n.language);
  const { appTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: appTheme === 'dark' ? dark : undefined,
      }}
      localization={localization}
    >
      {children}
    </ClerkProvider>
  );
}
