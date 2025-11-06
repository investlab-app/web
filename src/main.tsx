import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  useIsRestoring,
} from '@tanstack/react-query';
import { StrictMode, useEffect } from 'react';
import { PostHogProvider } from 'posthog-js/react';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { routeTree } from './routeTree.gen';
import { WSProvider } from './features/shared/providers/ws-provider.tsx';
import { Conditional } from './features/shared/components/conditional.tsx';
import {
  CLERK_PUBLIC_KEY,
  IS_PROD,
  POSTHOG_HOST,
  POSTHOG_KEY,
} from './features/shared/utils/constants.ts';
import { ErrorComponent } from './features/shared/components/error-component.tsx';
import { RouterLoading } from './features/shared/components/router-loading.tsx';
import { ToasterProvider } from './features/shared/providers/toaster-provider.tsx';
import { useOnlineStatus } from './features/shared/hooks/use-online-status.tsx';
import { InAppNotificationsProvider } from './features/shared/providers/in-app-notifications-provider.tsx';
import { deleteCookie } from './features/shared/utils/cookies.ts';
import { ThemeProvider } from '@/features/shared/components/theme-provider.tsx';
import { ClerkThemedProvider } from '@/features/shared/providers/clerk-themed-provider.tsx';
import './i18n/config.ts';
import './styles.css';
import '@fontsource-variable/spline-sans';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - consider data fresh for 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      meta: {
        persist: true,
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error: Error) => {
      if (import.meta.env.DEV) {
        console.error(`API Error: ${error.message}`);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: Error) => {
      if (import.meta.env.DEV) {
        console.error(`API Error: ${error.message}`);
      }
    },
  }),
});

export type RouterContext = {
  auth: ReturnType<typeof useAuth>;
  isLoggedInBefore: boolean;
  i18n: ReturnType<typeof useTranslation>;
  queryClient: QueryClient;
};

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
    isLoggedInBefore: undefined!,
    i18n: undefined!,
  },
  defaultErrorComponent: ({ error }) => {
    return <ErrorComponent error={error} />;
  },
  defaultPendingComponent: () => <RouterLoading />,
});

function App() {
  const isOnline = useOnlineStatus();
  const i18n = useTranslation();
  const auth = useAuth();
  const clerk = useClerk();
  const isSessionCookie = document.cookie.includes('__session=');
  const isLoggedInBefore = isSessionCookie || auth.isSignedIn;
  const isRestoring = useIsRestoring();

  useEffect(() => {
    // ensure session is fresh when back online
    if (isOnline && !clerk.loaded) {
      clerk.session?.reload();
    }
  }, [isOnline, clerk]);

  useEffect(() => {
    console.log(`Auth loaded: ${auth.isLoaded}, Signed in: ${auth.isSignedIn}`);
    if (auth.isLoaded && !auth.isSignedIn) {
      console.log(`isSessionCookie: ${isSessionCookie}`);
      if (isSessionCookie) {
        auth.signOut();
      } else {
        sessionStorage.clear();
        localStorage.clear();
        deleteCookie('__session');
      }
    }
  }, [auth, isSessionCookie]);

  if (isRestoring) {
    return null;
  }

  return (
    <WSProvider>
      <ToasterProvider>
        <InAppNotificationsProvider>
          <RouterProvider
            context={{ queryClient, auth, isLoggedInBefore, i18n }}
            router={router}
          />
        </InAppNotificationsProvider>
      </ToasterProvider>
    </WSProvider>
  );
}

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
});

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <ClerkThemedProvider publicKey={CLERK_PUBLIC_KEY}>
          <Conditional
            condition={IS_PROD}
            component={PostHogProvider}
            props={{
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
                persister,
                dehydrateOptions: {
                  shouldDehydrateQuery: (query) => query.meta?.persist === true,
                },
              }}
            >
              <App />
            </PersistQueryClientProvider>
          </Conditional>
        </ClerkThemedProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
