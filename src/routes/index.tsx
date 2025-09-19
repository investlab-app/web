import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/routes/-components/landing-page';
import { Dashboard } from '@/routes/-components/dashboard';
import { assetAllocationQueryOptions } from '@/features/home/components/asset-allocation-container';
import { accountValueOverTimeQueryOptions } from '@/features/home/components/account-value-chart-container';
import { ownedSharesQueryOptions } from '@/features/home/components/asset-table-container';
import { currentAccountValueQueryOptions } from '@/features/home/queries/fetch-current-account-value';
import { investorStatsQueryOptions } from '@/features/home/queries/fetch-investor-stats';

export const Route = createFileRoute('/')({
  loader: async ({ context: { queryClient, auth, i18n } }) => {
    if (!auth.isSignedIn) {
      return;
    }
    await Promise.all([
      queryClient.prefetchQuery(investorStatsQueryOptions),
      queryClient.prefetchQuery(assetAllocationQueryOptions),
      queryClient.prefetchQuery(currentAccountValueQueryOptions),
      queryClient.prefetchQuery(accountValueOverTimeQueryOptions),
      queryClient.prefetchQuery(ownedSharesQueryOptions),
    ]);
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
