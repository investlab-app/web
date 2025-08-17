import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { fetchInvestorStats } from '../queries/fetch-investor-stats';
import { StatTile } from './account-stat-tile';
import { authedQueryOptions } from '@/utils/authed-query-options';

export const investorStatsQueryOptions = authedQueryOptions({
  queryKey: ['investorStats'],
  queryFn: async (token) => {
    return await fetchInvestorStats(token);
  },
});

const AccountOverviewRibbon = () => {
  const { t } = useTranslation();
  const { getToken } = useAuth();

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    ...investorStatsQueryOptions(getToken),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!stats || isError) {
    return <div>Error loading stats</div>;
  }

  const tiles = [
    {
      title: t('investor.todays_return'),
      value: stats.todays_return,
      isProgress: true,
    },
    {
      title: t('investor.total_return'),
      value: stats.total_return,
      isProgress: true,
    },
    {
      title: t('investor.invested'),
      value: stats.invested,
      isProgress: false,
    },
    {
      title: t('investor.total_value'),
      value: stats.total_value,
      isProgress: false,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
      {tiles.map((tile, index) => (
        <StatTile
          key={index}
          title={tile.title}
          value={tile.value}
          isProgress={tile.isProgress}
          currency={t('common.currency')}
        />
      ))}
    </div>
  );
};

export default AccountOverviewRibbon;
