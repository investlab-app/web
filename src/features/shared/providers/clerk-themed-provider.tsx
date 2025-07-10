import { useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
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

export function ClerkThemedProvider({
  children,
  publicKey: clerkPubKey,
}: {
  children: ReactNode;
  publicKey: string;
}) {
  const { i18n } = useTranslation();
  const localization = languageMatcher(i18n.language);

  const { theme } = useTheme();
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  const clerkTheme = effectiveTheme === 'dark' ? dark : undefined;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: clerkTheme,
        variables: {
          colorBackground: '#18181b',
        },
      }}
      localization={localization}
    >
      {children}
    </ClerkProvider>
  );
}
