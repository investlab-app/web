import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import type { RouterContext } from '@/main';
import { IS_PROD } from '@/features/shared/utils/constants';
import '@/i18n/config';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <RootComponent />,
});

function RootComponent() {
  const isTauri = 'isTauri' in window;

  return (
    <>
      <Outlet />
      {!IS_PROD && (
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
      )}
    </>
  );
}
