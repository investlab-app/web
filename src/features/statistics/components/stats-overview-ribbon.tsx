import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { StatTile } from '@/features/shared/components/stat-tile';
import { LoadingCard } from '@/features/shared/components/loading-card';
import { ErrorCard } from '@/features/shared/components/error-card';
import { statisticsOverviewQueryOptions } from '../queries/fetch-statistics-overview';


const StatsOverviewRibbon = () => {
  const { t } = useTranslation();

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    ...statisticsOverviewQueryOptions,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const tiles = [
    {
      title: t('statistics.total_trades'),
      value: stats?.total_trades,
      unformatted: true
    },
    {
      title: t('statistics.buys_sells'),
      value: stats?.buys_sells,
      unformatted: true
    },
    {
      title: t('statistics.avg_gain'),
      value: stats?.avg_gain,
      isPercentage: true,
      coloring: true,
    },
    {
      title: t('statistics.avg_loss'),
      value: stats?.avg_loss,
      isPercentage: true,
        coloring: true,
    },
    {
      title: t('statistics.total_return'),
      value: stats?.total_return,
      isProgress: true,
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
        unformatted={tile.unformatted}
        isPercentage={tile.isPercentage}
        isProgress={tile.isProgress}
        currency={t('common.currency')}
        coloring={tile.coloring}
      />
    );
  }

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      {tiles.map((tile, index) => renderStatTile(index, tile))}
    </div>
  );
};

export default StatsOverviewRibbon;
