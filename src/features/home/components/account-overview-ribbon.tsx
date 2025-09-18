import { useTranslation } from 'react-i18next';
import { useQueries } from '@tanstack/react-query';
import { StatTile } from '../../shared/components/stat-tile';
import { currentAccountValueQueryOptions } from '../queries/fetch-current-account-value';
import { investorStatsQueryOptions } from '../queries/fetch-investor-stats';
import { ErrorCard } from '@/features/shared/components/error-card';
import { toFixedLocalized } from '@/features/shared/utils/numbers';
import { tradingOverviewQueryOptions } from '@/features/statistics/queries/fetch-trading-overview';

const AccountOverviewRibbon = () => {
  const { t, i18n } = useTranslation();

  const {
    data: stats,
    isPending,
    isError,
  } = useQueries({
    queries: [
      investorStatsQueryOptions,
      tradingOverviewQueryOptions,
      currentAccountValueQueryOptions,
    ],
    combine: (results) => {
      const [investorStats, tradingOverview, currentAccountValue] = results;
      return {
        data: {
          ...(investorStats.data ?? {}),
          ...(tradingOverview.data ?? {}),
          ...(currentAccountValue.data ?? {}),
        },
        isPending: results.some((result) => result.isPending),
        isError: results.some((result) => result.isError),
      };
    },
  });

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
      {tiles.map((tile, index) =>
        isPending ? (
          <StatTile.Skeleton />
        ) : isError || !tile.value ? (
          <ErrorCard />
        ) : (
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
        )
      )}
    </div>
  );
};

export default AccountOverviewRibbon;
