import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import MostTradedOverview from '@/features/statistics/components/most-traded-overview';
import ProfileOverview from '@/features/statistics/components/profile-overview';
import StatsOverviewRibbon from '@/features/statistics/components/stats-overview-ribbon';

export const Route = createFileRoute('/_authed/statistics/')({
  component: StatistisPage,
});

function StatistisPage() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">
        {t('statistics.overview_title')}
      </h2>
      <StatsOverviewRibbon />
      <h2 className="text-2xl font-semibold mt-6 mb-4">
        {t('statistics.most_traded_overview_title')}
      </h2>
      <MostTradedOverview rowCount={5} />
      <h2 className="text-2xl font-semibold mt-6 mb-4">
        {t('statistics.profile_overview_title')}
      </h2>
      <ProfileOverview />
    </div>
  );
}
