import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ context: { auth, isLoggedInBefore } }) => {
    if (!isLoggedInBefore) {
      if (!auth.isLoaded) {
        while (!auth.isLoaded) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } else {
        console.error('Not logged in -- redirecting')
        throw redirect({ to: '/' });
      }

    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { auth, isLoggedInBefore } = Route.useRouteContext();

  if (!auth.isLoaded && isLoggedInBefore) {
    console.log("Loaded and logged in before")
    return <Outlet />;
  }

  if (!auth.isSignedIn) {
    console.error("Not signed in -- redirecting")
    throw redirect({ to: '/' });
  }

  return <Outlet />;
}
