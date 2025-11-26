import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ context: { auth, isLoggedInBefore } }) => {
    if (!isLoggedInBefore) {
      if (!auth.isLoaded) {
        while (!auth.isLoaded) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } else {
        throw redirect({ to: '/' });
      }
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { auth, isLoggedInBefore } = Route.useRouteContext();

  if (!auth.isLoaded && isLoggedInBefore) {
    return <Outlet />;
  }

  if (!auth.isSignedIn) {
    throw redirect({ to: '/' });
  }

  return <Outlet />;
}
