import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import './i18n/config.ts';
import './styles.css';
import reportWebVitals from './reportWebVitals.ts';
import { SSEProvider } from './features/shared/hooks/SSEProvider.tsx';
import type { ReactNode } from '@tanstack/react-router';
import { ThemeProvider, useTheme } from '@/components/theme-provider';

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

const queryClient = new QueryClient();

// Get the Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

// Component to handle Clerk with theme support
function ClerkProviderWithTheme({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

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

  // Determine the effective theme
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  // Select the appropriate Clerk theme (undefined = light theme)
  const clerkTheme = effectiveTheme === 'dark' ? dark : undefined;

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{ baseTheme: clerkTheme }}
    >
      {children}
    </ClerkProvider>
  );
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // <StrictMode>
      <ThemeProvider>
        <ClerkProviderWithTheme>
          <QueryClientProvider client={queryClient}>
            <SSEProvider>
              <RouterProvider router={router} />
            </SSEProvider>
          </QueryClientProvider>
        </ClerkProviderWithTheme>
      </ThemeProvider>
    // </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
