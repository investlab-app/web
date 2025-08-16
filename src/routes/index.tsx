import { SignedIn, SignedOut } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/routes/_index/-landing-page';
import { Home } from '@/routes/_index/-home-page';
import { investorStatsQueryOptions } from '@/features/home/components/account-overview-ribbon';
import { assetAllocationQueryOptions } from '@/features/home/components/asset-allocation-container';
import { currentAccountValueQueryOptions } from '@/features/shared/components/wallet-section';
import { accountValueOverTimeQueryOptions } from '@/features/home/components/account-value-chart-container';
import { ownedSharesQueryOptions } from '@/features/home/components/asset-table-container';

export const Route = createFileRoute('/')({
  loader: async ({ context: { token, queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(investorStatsQueryOptions(token)),
      queryClient.ensureQueryData(assetAllocationQueryOptions(token)),
      queryClient.ensureQueryData(currentAccountValueQueryOptions(token)),
      queryClient.ensureQueryData(accountValueOverTimeQueryOptions(token)),
      queryClient.ensureQueryData(ownedSharesQueryOptions(token)),
    ]);
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
