import { useTranslation } from 'react-i18next';
import { Divider as DividerComponent } from '@/features/shared/components/ui/divider';

export const Divider = () => {
  const { t } = useTranslation();

  return (
    <div className="py-4">
      <DividerComponent
        text={t('auth.or_continue')}
        backgroundClass="bg-card"
      />
    </div>
  );
};
