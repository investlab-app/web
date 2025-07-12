import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { routeTree } from './routeTree.gen';
import { SSEProvider } from './features/shared/providers/sse-provider';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@/features/shared/components/theme-provider';
import { ClerkThemedProvider } from '@/features/shared/providers/clerk-themed-provider';
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

const queryClient = new QueryClient();

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <ClerkThemedProvider publicKey={CLERK_PUBLIC_KEY}>
          <QueryClientProvider client={queryClient}>
            <SSEProvider>
              <RouterProvider router={router} />
            </SSEProvider>
          </QueryClientProvider>
        </ClerkThemedProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
