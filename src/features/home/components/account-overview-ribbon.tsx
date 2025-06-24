import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { fetchInvestorStats } from '../queries/fetch-investor-stats';
import { StatTile } from './account-stat-tile';

const AccountOverviewRibbon = () => {
  const { t } = useTranslation();
  const { getToken } = useAuth();

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['investorStats'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No auth token');
      return fetchInvestorStats(token);
    },
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatTile.Skeleton key={index} isProgress={index < 2} />
        ))}
      </div>
    );
  }
  if (error || !stats) {
    return (
      <div className="h-24 flex items-center justify-center text-gray-500">
        {t('common.error')}
      </div>
    );
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
