import { SignedIn, SignedOut } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/routes/_index/-landing-page';
import { Home } from '@/routes/_index/-home-page';
import { investorStatsQueryOptions } from '@/features/home/components/account-overview-ribbon';

export const Route = createFileRoute('/')({
  loader: async ({ context: { token, queryClient } }) => {
    if (!token) {
      throw new Error('No auth token');
    }
    await queryClient.ensureQueryData(investorStatsQueryOptions(() => Promise.resolve(token)));
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
