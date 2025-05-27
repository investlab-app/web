import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { ClerkProvider } from '@clerk/tanstack-react-start';
import { ThemeProvider } from '@/components/theme-provider';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Clerk publishable key missing');
}

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <Outlet />
        </ClerkProvider>
      </ThemeProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
