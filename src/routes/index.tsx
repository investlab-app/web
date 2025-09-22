import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/routes/-components/landing-page';
import { Dashboard } from '@/routes/-components/dashboard';

export const Route = createFileRoute('/')({
  loader: ({ context: { auth, i18n } }) => {
    if (!auth.isSignedIn) {
      return;
    }

    return {
      crumb: i18n.t('common.dashboard'),
    };
  },
  component: Index,
});

function Index() {
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
