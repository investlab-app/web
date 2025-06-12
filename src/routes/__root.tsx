import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { ThemeProvider, useTheme } from '@/components/theme-provider';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Clerk publishable key missing');
}

function ClerkProviderWithTheme({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  // Determine the effective theme
  const effectiveTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  // Select the appropriate Clerk theme (undefined = light theme)
  const clerkTheme = effectiveTheme === 'dark' ? dark : undefined;

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{ baseTheme: clerkTheme }}
    >
      {children}
    </ClerkProvider>
  );
}

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider>
        <ClerkProviderWithTheme>
          <Outlet />
        </ClerkProviderWithTheme>
      </ThemeProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
