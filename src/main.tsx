import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { PostHogProvider } from 'posthog-js/react';
import { ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { routeTree } from './routeTree.gen';
import { SSEProvider } from './features/shared/providers/sse-provider.tsx';
import { ConditionalProvider } from './features/shared/providers/conditional-provider.tsx';
import {
  CLERK_PUBLIC_KEY,
  IS_PROD,
  POSTHOG_HOST,
  POSTHOG_KEY,
} from './features/shared/utils/constants.ts';
import { ErrorComponent } from './features/shared/components/error-component.tsx';
import { ThemeProvider } from '@/features/shared/components/theme-provider.tsx';
import { ClerkThemedProvider } from '@/features/shared/providers/clerk-themed-provider.tsx';
import './i18n/config.ts';
import './styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export type RouterContext = {
  auth: ReturnType<typeof useAuth>;
  queryClient: QueryClient;
};

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient,
  },
  defaultErrorComponent: ({ error }) => {
    return <ErrorComponent error={error} />;
  },
});

function App() {
  const auth = useAuth();
  return <RouterProvider context={{ auth, queryClient }} router={router} />;
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
          <ConditionalProvider
            condition={IS_PROD}
            provider={PostHogProvider}
            providerProps={{
              apiKey: POSTHOG_KEY,
              options: { api_host: POSTHOG_HOST },
            }}
          >
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{ persister }}
            >
              <SSEProvider>
                <ClerkLoaded>
                  <App />
                </ClerkLoaded>
              </SSEProvider>
            </PersistQueryClientProvider>
          </ConditionalProvider>
        </ClerkThemedProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
