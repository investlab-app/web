import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';

export function ErrorCard() {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex justify-center items-center">
        {t('common.error')}
      </div>
    </Card>
  );
}
