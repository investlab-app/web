import { SignedIn, SignedOut } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/routes/_index/-landing-page';
import { Home } from '@/routes/_index/-home-page';
import { investorStatsQueryOptions } from '@/features/home/components/account-overview-ribbon';

export const Route = createFileRoute('/')({
  loader: async ({ context: { token, queryClient } }) => {
    await queryClient.ensureQueryData(investorStatsQueryOptions(token));
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
