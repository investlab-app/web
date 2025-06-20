import { useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import type { ReactNode } from '@tanstack/react-router';
import { useTheme } from '@/features/shared/components/theme-provider.tsx';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

export function ClerkThemedProvider({ children }: { children: ReactNode }) {
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
      appearance={{ baseTheme: clerkTheme }}
    >
      {children}
    </ClerkProvider>
  );
}
