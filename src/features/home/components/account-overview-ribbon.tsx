import { useTranslation } from 'react-i18next';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/tanstack-react-start';
import { fetchInvestorStats } from '../queries/fetch-investor-stats';
import { StatTile } from './account-stat-tile';

export const investorStatsQueryOptions = (
  getToken: () => Promise<string | null | undefined>
) =>
  queryOptions({
    queryKey: ['investorStats'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No auth token');
      return fetchInvestorStats(token);
    },
  });

const AccountOverviewRibbon = () => {
  const { t } = useTranslation();
  const { getToken } = useAuth();

  const { data: stats } = useSuspenseQuery(investorStatsQueryOptions(getToken));

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
