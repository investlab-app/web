import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context: { isLoggedInBefore } }) => {
    if (!isLoggedInBefore) {
      throw redirect({ to: '/' });
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
