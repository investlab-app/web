import { useTranslation } from 'react-i18next';
import { StatTile } from './account-stat-tile';

const AccountOverviewRibbon = () => {
  const { t } = useTranslation();
  const tiles = [
    {
      title: t('investor.todays_return'),
      value: 39.35,
      isProgress: true,
    },
    {
      title: t('investor.total_return'),
      value: -432.34,
      isProgress: true,
    },
    {
      title: t('investor.invested'),
      value: 523.35,
      isProgress: false,
    },
    {
      title: t('investor.total_value'),
      value: 2353.52,
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
