import { useTranslation } from 'react-i18next';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchInvestorStats } from '../queries/fetch-investor-stats';
import { StatTile } from '../../shared/components/stat-tile';
import { ErrorCard } from '@/features/shared/components/error-card';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

export const investorStatsQueryOptions = queryOptions({
  queryKey: ['investorStats'],
  queryFn: fetchInvestorStats,
});

const AccountOverviewRibbon = () => {
  const { t, i18n } = useTranslation();

  const {
    data: stats,
    isPending,
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
    if (isPending) {
      return <StatTile.Skeleton />;
    }

    if (isError || !tile.value) {
      return <ErrorCard />;
    }

    return (
      <StatTile
        key={index}
        title={tile.title}
        value={`${toFixedLocalized(tile.value, i18n.language, 2)} ${t('common.currency')}`}
        isProgress={tile.isProgress}
        coloring={
          tile.isProgress
            ? tile.value >= 0
              ? StatTile.Coloring.POSITIVE
              : StatTile.Coloring.NEGATIVE
            : StatTile.Coloring.NEUTRAL
        }
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
