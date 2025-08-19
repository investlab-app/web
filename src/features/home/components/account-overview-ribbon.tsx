import { useTranslation } from 'react-i18next';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchInvestorStats } from '../queries/fetch-investor-stats';
import { StatTile } from './account-stat-tile';
import { LoadingCard } from '@/features/shared/components/loading-card';
import { ErrorCard } from '@/features/shared/components/error-card';

export const investorStatsQueryOptions = queryOptions({
  queryKey: ['investorStats'],
  queryFn: fetchInvestorStats,
});

const AccountOverviewRibbon = () => {
  const { t } = useTranslation();

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    ...investorStatsQueryOptions,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const tiles = [
    {
      title: t('investor.todays_return'),
      value: stats?.todays_return,
      isProgress: true,
    },
    {
      title: t('investor.total_return'),
      value: stats?.total_return,
      isProgress: true,
    },
    {
      title: t('investor.invested'),
      value: stats?.invested,
      isProgress: false,
    },
    {
      title: t('investor.total_value'),
      value: stats?.total_value,
      isProgress: false,
    },
  ];

  function renderStatTile(index: number, tile: (typeof tiles)[number]) {
    if (isLoading) {
      return <LoadingCard />;
    }

    if (!stats || isError || !tile.value) {
      return <ErrorCard />;
    }

    return (
      <StatTile
        key={index}
        title={tile.title}
        value={tile.value}
        isProgress={tile.isProgress}
        currency={t('common.currency')}
      />
    );
  }

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
      {tiles.map((tile, index) => renderStatTile(index, tile))}
    </div>
  );
};

export default AccountOverviewRibbon;
