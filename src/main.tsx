import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { PostHogProvider } from 'posthog-js/react';
import { ClerkLoaded, useAuth, useUser } from '@clerk/clerk-react';
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
    },
  },
});

export type RouterContext = {
  auth: ReturnType<typeof useAuth>;
  user: ReturnType<typeof useUser>;
  queryClient: QueryClient;
};

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    user: undefined!,
    queryClient,
  },
  defaultErrorComponent: ({ error }) => {
    return <ErrorComponent error={error} />;
  },
});

function App() {
  const auth = useAuth();
  const user = useUser();

  return (
    <RouterProvider context={{ auth, user, queryClient }} router={router} />
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
              options: { api_host: POSTHOG_HOST },
            }}
          >
            <QueryClientProvider client={queryClient}>
              <SSEProvider>
                <ClerkLoaded>
                  <App />
                </ClerkLoaded>
              </SSEProvider>
            </QueryClientProvider>
          </ConditionalProvider>
        </ClerkThemedProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
