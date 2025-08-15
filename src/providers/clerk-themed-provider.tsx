import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { enUS, plPL } from '@clerk/localizations';
import { useTranslation } from 'react-i18next';
import { match } from 'arktype';
import type { ReactNode } from 'react';
import { useTheme } from '@/components/theme-provider';

const languageMatcher = match.in<string>().match({
  "'pl'": () => plPL,
  "'en'": () => enUS,
  default: (lang) => {
    console.error(`Unsupported language: ${lang}. Defaulting to 'en'`);
    return enUS;
  },
});

export function ClerkThemedProvider({
  children,
  publicKey,
}: {
  children: ReactNode;
  publicKey: string;
}) {
  const { i18n } = useTranslation();
  const localization = languageMatcher(i18n.language);
  const { appTheme: theme } = useTheme();

  console.log(`Theme: ${theme}`);

  return (
    <ClerkProvider
      publishableKey={publicKey}
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
      }}
      localization={localization}
    >
      {children}
    </ClerkProvider>
  );
}
