import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { tradingOverviewQueryOptions } from '../queries/fetch-trading-overview';
import { StatTile } from '@/features/shared/components/stat-tile';
import { ErrorCard } from '@/features/shared/components/error-card';

const StatsOverviewRibbon = () => {
  const { t } = useTranslation();

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery(tradingOverviewQueryOptions);

  const tiles = [
    {
      title: t('statistics.total_trades'),
      value: stats?.total_trades.toString(),
    },
    {
      title: t('statistics.buys_sells'),
      value: `${stats?.buys}/${stats?.sells}`,
    },
    {
      title: t('statistics.avg_gain'),
      value: `${stats?.avg_gain} ${t('common.currency')}`,
      coloring: stats
        ? stats.avg_gain > 0
          ? StatTile.Coloring.POSITIVE
          : StatTile.Coloring.NEUTRAL
        : StatTile.Coloring.NEUTRAL,
    },
    {
      title: t('statistics.avg_loss'),
      value: `${stats?.avg_loss} ${t('common.currency')}`,
      coloring: stats
        ? stats.avg_loss > 0
          ? StatTile.Coloring.NEGATIVE
          : StatTile.Coloring.NEUTRAL
        : StatTile.Coloring.NEUTRAL,
    },
    {
      title: t('statistics.total_return'),
      value: `${stats?.total_return} ${t('common.currency')}`,
    },
  ];

  function renderStatTile(index: number, tile: (typeof tiles)[number]) {
    if (isLoading) {
      return <StatTile.Skeleton />;
    }

    if (isError || !tile.value) {
      return <ErrorCard />;
    }

    return (
      <StatTile
        key={index}
        title={tile.title}
        value={tile.value}
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
