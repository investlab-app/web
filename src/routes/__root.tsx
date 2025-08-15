/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { PostHogProvider } from 'posthog-js/react';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { createServerFn } from '@tanstack/react-start';
import * as React from 'react';
import { getAuth } from '@clerk/tanstack-react-start/server';
import { getWebRequest } from '@tanstack/react-start/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary.js';
import { NotFound } from '@/components/NotFound.js';
import { ThemeProvider } from '@/features/shared/components/theme-provider.tsx';
import appCss from '@/styles/app.css?url';
import { ClerkThemedProvider } from '@/features/shared/providers/clerk-themed-provider';
import { SSEProvider } from '@/features/shared/providers/sse-provider';
import '@/i18n/config';

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await getAuth(getWebRequest());

  return {
    userId,
  };
});

export const Route = createRootRoute({
  beforeLoad: async () => {
    const { userId } = await fetchClerkAuth();
    return { userId };
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
if (!POSTHOG_KEY) {
  throw new Error('VITE_PUBLIC_POSTHOG_KEY is not defined');
}

const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
if (!POSTHOG_HOST) {
  throw new Error('VITE_PUBLIC_POSTHOG_HOST is not defined');
}

const queryClient = new QueryClient();

function RootComponent() {
  return (
    <ThemeProvider>
      <ClerkThemedProvider>
        <PostHogProvider
          apiKey={POSTHOG_KEY}
          options={{ api_host: POSTHOG_HOST }}
        >
          <QueryClientProvider client={queryClient}>
            <SSEProvider>
              <RootDocument>
                <Outlet />
              </RootDocument>
            </SSEProvider>
          </QueryClientProvider>
        </PostHogProvider>
      </ClerkThemedProvider>
    </ThemeProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          plugins={[
            {
              name: 'TanStack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
