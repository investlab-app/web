import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { StatTile } from '@/features/shared/components/stat-tile';
import { ErrorCard } from '@/features/shared/components/error-card';
import { statisticsStatisticsTradingOverviewRetrieveOptions } from '@/client/@tanstack/react-query.gen';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

const StatsOverviewRibbon = () => {
  const { i18n, t } = useTranslation();

  const {
    data: stats,
    isPending,
    isError,
  } = useQuery(statisticsStatisticsTradingOverviewRetrieveOptions());

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
      title: t('statistics.total_return'),
      value: stats?.total_gain
        ? toFixedLocalized(stats.total_gain, i18n.language, 2)
        : undefined,
      coloring: stats
        ? stats.total_gain > 0
          ? StatTile.Coloring.POSITIVE
          : StatTile.Coloring.NEUTRAL
        : StatTile.Coloring.NEUTRAL,
    },
  ];

  function RenderStatTile({
    index,
    tile,
  }: {
    index: number;
    tile: (typeof tiles)[number];
  }) {
    if (isPending) {
      return <StatTile.Skeleton />;
    }

    if (isError || tile.value === undefined) {
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
      {tiles.map((tile, index) => (
        <RenderStatTile key={index} index={index} tile={tile} />
      ))}
    </div>
  );
};

export default StatsOverviewRibbon;
