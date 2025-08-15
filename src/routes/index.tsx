import { SignedIn, SignedOut } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';
import { isServer } from '@tanstack/react-query';
import { LandingPage } from '@/routes/_index/-landing-page';
import { Home } from '@/routes/_index/-home-page';
import { investorStatsQueryOptions } from '@/features/home/components/account-overview-ribbon';

export const Route = createFileRoute('/')({
  loader: async ({ context: { token, queryClient } }) => {
    if (isServer) {
      return await queryClient.ensureQueryData(investorStatsQueryOptions(token));
    }
    return;
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
        <Home />
      </SignedIn>
    </>
  );
}
