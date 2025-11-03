import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { StatTile } from '../../shared/components/stat-tile';
import { toFixedLocalized } from '@/features/shared/utils/numbers';
import {
  statisticsCurrentAccountValueRetrieveOptions,
  statisticsStatsRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';
import { ErrorMessage } from '@/features/shared/components/error-message';
import { Card, CardContent } from '@/features/shared/components/ui/card';

const AccountOverviewRibbon = () => {
  const { t, i18n } = useTranslation();

  const {
    data: investorStats,
    isPending: statsPending,
    isError: statsError,
  } = useQuery(statisticsStatsRetrieveOptions());

  const {
    data: currentAccountValue,
    isPending: accountValuePending,
    isError: accountValueError,
  } = useQuery(statisticsCurrentAccountValueRetrieveOptions());

  const isPending = statsPending || accountValuePending;
  const isError = statsError || accountValueError;

  if (isError) {
    return (
      <Card>
        <CardContent>
          <ErrorMessage message={t('common.error_loading_data')} />
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatTile.Skeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  const tiles = [
    {
      title: t('investor.todays_return'),
      value: investorStats.todays_gain,
      isProgress: true,
    },
    {
      title: t('investor.total_return'),
      value: investorStats.total_gain,
      isProgress: true,
    },
    {
      title: t('investor.invested'),
      value: investorStats.invested,
      isProgress: false,
    },
    {
      title: t('investor.total_account_value'),
      value: currentAccountValue.total_account_value,
      isProgress: false,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile, index) => (
        <StatTile
          key={index}
          title={tile.title}
          value={toFixedLocalized(tile.value, i18n.language, 2)}
          isProgress={tile.isProgress}
          coloring={
            tile.isProgress
              ? tile.value >= 0
                ? StatTile.Coloring.POSITIVE
                : StatTile.Coloring.NEGATIVE
              : StatTile.Coloring.NEUTRAL
          }
        />
      ))}
    </div>
  );
};

export default AccountOverviewRibbon;
