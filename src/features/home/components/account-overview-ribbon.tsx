import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { StatTile } from '../../shared/components/stat-tile';
import { ErrorCard } from '@/features/shared/components/error-card';
import { toFixedLocalized } from '@/features/shared/utils/numbers';
import {
  investorsMeCurrentAccountValueRetrieveOptions,
  investorsMeStatsRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';

const AccountOverviewRibbon = () => {
  const { t, i18n } = useTranslation();

  const {
    data: investorStats,
    isPending: statsPending,
    isError: statsError,
  } = useQuery(investorsMeStatsRetrieveOptions());

  const {
    data: currentAccountValue,
    isPending: accountValuePending,
    isError: accountValueError,
  } = useQuery(investorsMeCurrentAccountValueRetrieveOptions());

  const isPending = statsPending || accountValuePending;
  const isError = statsError || accountValueError;

  const tiles = [
    {
      title: t('investor.todays_return'),
      value: investorStats?.todays_return,
      isProgress: true,
    },
    {
      title: t('investor.total_return'),
      value: investorStats?.total_return,
      isProgress: true,
    },
    {
      title: t('investor.invested'),
      value: investorStats?.invested,
      isProgress: false,
    },
    {
      title: t('investor.total_account_value'),
      value: currentAccountValue?.total_account_value,
      isProgress: false,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
      {tiles.map((tile, index) =>
        isPending ? (
          <StatTile.Skeleton key={`skeleton-${index}`} />
        ) : isError || tile.value === undefined ? (
          <ErrorCard key={`error-${index}`} />
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
