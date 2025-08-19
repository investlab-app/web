import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { createFileRoute } from '@tanstack/react-router';
import { type } from 'arktype';
import { useEffect } from 'react';
import { LandingPage } from '@/routes/-components/landing-page';
import { Dashboard } from '@/routes/-components/dashboard';
import { syncLanguage } from '@/features/shared/queries/update-language';

export const Route = createFileRoute('/')({
  validateSearch: type({
    initial_session: 'boolean?',
  }),
  loader: ({ context: { i18n } }) => {
    return {
      crumb: i18n.t('common.dashboard'),
    };
  },
  component: Index,
});

function Index() {
  const { auth, isLoggedInBefore } = Route.useRouteContext();

  const { initial_session } = Route.useSearch();

  useEffect(() => {
    if (!initial_session) return;
    void syncLanguage();
  }, [initial_session]);

  if (!auth.isLoaded && isLoggedInBefore) {
    return <Dashboard />;
  }

  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}
