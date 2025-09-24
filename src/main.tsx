import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { PostHogProvider } from 'posthog-js/react';
import { ClerkLoaded, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { routeTree } from './routeTree.gen';
import { WSProvider } from './features/shared/providers/ws-provider.tsx';
import { ConditionalProvider } from './features/shared/providers/conditional-provider.tsx';
import {
  CLERK_PUBLIC_KEY,
  IS_PROD,
  POSTHOG_HOST,
  POSTHOG_KEY,
} from './features/shared/utils/constants.ts';
import { ErrorComponent } from './features/shared/components/error-component.tsx';
import { ToasterProvider } from './features/shared/providers/toaster-provider.tsx';
import { ThemeProvider } from '@/features/shared/components/theme-provider.tsx';
import { ClerkThemedProvider } from '@/features/shared/providers/clerk-themed-provider.tsx';
import './i18n/config.ts';
import './styles.css';
import '@fontsource-variable/spline-sans';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      meta: {
        persist: true,
      },
    },
  },
});

export type RouterContext = {
  auth: ReturnType<typeof useAuth>;
  i18n: ReturnType<typeof useTranslation>;
  queryClient: QueryClient;
};

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
    i18n: undefined!,
  },
  defaultErrorComponent: ({ error }) => {
    return <ErrorComponent error={error} />;
  },
});

function App() {
  const auth = useAuth();
  const i18n = useTranslation();

  return (
    <RouterProvider context={{ queryClient, auth, i18n }} router={router} />
  );
}

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <ClerkThemedProvider publicKey={CLERK_PUBLIC_KEY}>
          <ConditionalProvider
            condition={IS_PROD}
            provider={PostHogProvider}
            providerProps={{
              apiKey: POSTHOG_KEY,
              options: {
                api_host: POSTHOG_HOST,
                cookieless_mode: 'always',
              },
            }}
          >
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{
                persister: createAsyncStoragePersister({
                  storage: window.localStorage,
                }),
                dehydrateOptions: {
                  shouldDehydrateQuery: (query) => query.meta?.persist === true,
                },
              }}
            >
              <ClerkLoaded>
                <SignedIn>
                  <WSProvider>
                    <ToasterProvider>
                      <App />
                    </ToasterProvider>
                  </WSProvider>
                </SignedIn>
                <SignedOut>
                  <App />
                </SignedOut>
              </ClerkLoaded>
            </PersistQueryClientProvider>
          </ConditionalProvider>
        </ClerkThemedProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
