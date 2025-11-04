import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { z } from 'zod';
import { LandingPage } from '@/routes/-components/landing-page';
import { Dashboard } from '@/routes/-components/dashboard';
import { DashboardPending } from '@/routes/-components/dashboard-pending';
import { syncLanguage } from '@/features/shared/queries/update-language';
import {
  investorsMeAccountValueListOptions,
  statisticsAssetAllocationRetrieveOptions,
  statisticsCurrentAccountValueRetrieveOptions,
  statisticsOwnedSharesListOptions,
  statisticsStatsRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    initial_session: z.boolean().optional(),
  }),
  loader: async ({ context: { i18n, queryClient } }) => {
    try {
      await Promise.all([
        queryClient.ensureQueryData(statisticsStatsRetrieveOptions()),
        queryClient.ensureQueryData(
          statisticsCurrentAccountValueRetrieveOptions()
        ),
        queryClient.ensureQueryData(statisticsAssetAllocationRetrieveOptions()),
        queryClient.ensureQueryData(investorsMeAccountValueListOptions()),
        queryClient.ensureQueryData(statisticsOwnedSharesListOptions()),
      ]);
    } catch {}

    return {
      crumb: i18n.t('common.dashboard'),
    };
  },
  pendingComponent: DashboardPending,
  component: RouteComponent,
});

function RouteComponent() {
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
