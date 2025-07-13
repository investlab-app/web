import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { PostHogProvider } from 'posthog-js/react';
import { tryLoadAndStartRecorder } from '@alwaysmeticulous/recorder-loader';
import { routeTree } from './routeTree.gen';
import { SSEProvider } from './features/shared/providers/sse-provider.tsx';
import reportWebVitals from './reportWebVitals.ts';
import { ThemeProvider } from '@/features/shared/components/theme-provider.tsx';
import { ClerkThemedProvider } from '@/features/shared/providers/clerk-themed-provider.tsx';
import './i18n/config.ts';
import './styles.css';

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const CLERK_PUBLIC_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!CLERK_PUBLIC_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
if (!POSTHOG_KEY) {
  throw new Error('VITE_PUBLIC_POSTHOG_KEY is not defined');
}

const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
if (!POSTHOG_HOST) {
  throw new Error('VITE_PUBLIC_POSTHOG_HOST is not defined');
}

const queryClient = new QueryClient();

async function startApp() {
  // Record all sessions on localhost, staging stacks and preview URLs
  if (!import.meta.env.PROD) {
    // Start the Meticulous recorder before you initialise your app.
    // Note: all errors are caught and logged, so no need to surround with try/catch
    await tryLoadAndStartRecorder({
      recordingToken: 'sMZ4lrHXVO7hq0IH85aPiFyZRNIvgDMu7YSDqnVM',
      isProduction: false,
    });
  }

  // Initalise app after the Meticulous recorder is ready, e.g.
  const rootElement = document.getElementById('app');
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <ThemeProvider>
          <ClerkThemedProvider publicKey={CLERK_PUBLIC_KEY}>
            <PostHogProvider
              apiKey={POSTHOG_KEY}
              options={{ api_host: POSTHOG_HOST }}
            >
              <QueryClientProvider client={queryClient}>
                <SSEProvider>
                  <RouterProvider router={router} />
                </SSEProvider>
              </QueryClientProvider>
            </PostHogProvider>
          </ClerkThemedProvider>
        </ThemeProvider>
      </StrictMode>
    );
  }

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}

startApp();
