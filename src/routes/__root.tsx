/// <reference types="vite/client" />

import * as React from 'react';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { getWebRequest } from '@tanstack/react-start/server';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { PostHogProvider } from 'posthog-js/react';
import { createServerFn } from '@tanstack/react-start';
import { getAuth } from '@clerk/tanstack-react-start/server';
import type { QueryClient } from '@tanstack/react-query';
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary.js';
import { NotFound } from '@/components/NotFound.js';
import { ThemeProvider } from '@/features/shared/components/theme-provider.tsx';
import { ClerkThemedProvider } from '@/features/shared/providers/clerk-themed-provider';
import { SSEProvider } from '@/features/shared/providers/sse-provider';
import appCss from '@/styles/app.css?url';
import '@/i18n/config';

const isDev = import.meta.env.DEV;

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY!;
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST!;

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId, getToken } = await getAuth(getWebRequest());
  const token = await getToken();

  return { userId, token };
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    beforeLoad: async () => {
      return fetchClerkAuth();
    },
    head: () => ({
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'color-scheme', content: 'light dark' },
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
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'icon', href: '/favicon.ico' },
      ],
    }),
    errorComponent: (props) => (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    ),
    notFoundComponent: () => <NotFound />,
    component: RootComponent,
  }
);

type ConditionalProviderProps<T> = {
  condition: boolean;
  provider: React.ComponentType<T>;
  providerProps?: T;
  children: React.ReactNode;
};

function ConditionalProvider<T>({
  condition,
  provider: Provider,
  providerProps,
  children,
}: ConditionalProviderProps<T>) {
  return condition ? (
    <Provider {...(providerProps as T)}>{children}</Provider>
  ) : (
    <>{children}</>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <ThemeProvider>
      <ClerkThemedProvider>
        <ConditionalProvider
          condition={isDev}
          provider={PostHogProvider}
          providerProps={{
            apiKey: POSTHOG_KEY!,
            options: {
              api_host: POSTHOG_HOST!,
              loaded: (posthog) => {
                if (isDev) posthog.opt_out_capturing();
              },
            },
          }}
        >
          <QueryClientProvider client={queryClient}>
            <SSEProvider>
              <RootDocument>
                <Outlet />
              </RootDocument>
            </SSEProvider>
          </QueryClientProvider>
        </ConditionalProvider>
      </ClerkThemedProvider>
    </ThemeProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
