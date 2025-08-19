import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';

export function LoadingCard() {
  const { t } = useTranslation();

  return (
    <Card className="animate-pulse">
      <div className="flex justify-center items-center">
        {t('common.loading')}
      </div>
    </Card>
  );
}
