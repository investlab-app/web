import { createFileRoute } from '@tanstack/react-router';
import MostTradedOverview from '@/features/statistics/components/most-traded-overview';
import StatsOverviewRibbon from '@/features/statistics/components/stats-overview-ribbon';
import AppFrame from '@/features/shared/components/app-frame';

export const Route = createFileRoute('/_authed/statistics/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppFrame>
      <div className="space-y-4">
        <StatsOverviewRibbon />
        <MostTradedOverview />
      </div>
    </AppFrame>
  );
}
