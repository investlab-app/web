import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { QueryClient, dehydrate, hydrate } from '@tanstack/react-query';

import { routeTree } from './routeTree.gen';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { NotFound } from './components/NotFound';
import type { DehydratedState } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
    },
  },
});

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
    context: {
      queryClient,
    },
    // Ensure React Query cache is serialized on the server and restored on the client
    dehydrate: () => ({ reactQuery: dehydrate(queryClient) }),
    hydrate: (dehydrated: { reactQuery?: DehydratedState }) => {
      const state = dehydrated.reactQuery;
      if (state) {
        hydrate(queryClient, state);
      }
    },
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
