import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/routes/-components/landing-page';
import { Dashboard } from '@/routes/-components/dashboard';
import { investorStatsQueryOptions } from '@/features/home/components/account-overview-ribbon';
import { assetAllocationQueryOptions } from '@/features/home/components/asset-allocation-container';
import { currentAccountValueQueryOptions } from '@/components/wallet-section';
import { accountValueOverTimeQueryOptions } from '@/features/home/components/account-value-chart-container';
import { ownedSharesQueryOptions } from '@/features/home/components/asset-table-container';

export const Route = createFileRoute('/')({
  loader: async ({ context: { auth, queryClient } }) => {
    const token = await auth.getToken();
    if (!token) return;
    await Promise.all([
      queryClient.prefetchQuery(investorStatsQueryOptions(token)),
      queryClient.prefetchQuery(assetAllocationQueryOptions(token)),
      queryClient.prefetchQuery(currentAccountValueQueryOptions(token)),
      queryClient.prefetchQuery(accountValueOverTimeQueryOptions(token)),
      queryClient.prefetchQuery(ownedSharesQueryOptions(token)),
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
        <Dashboard />
      </SignedIn>
    </>
  );
}
