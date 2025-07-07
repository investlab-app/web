import { useTranslation } from 'react-i18next';
import { useRouter } from '@tanstack/react-router';
import { Button } from '@/features/shared/components/ui/button';

export const BackButton = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => router.history.back()}
      className="w-full"
    >
      {t('common.go_back')}
    </Button>
  );
};
