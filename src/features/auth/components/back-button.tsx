import { useTranslation } from 'react-i18next';
import { useRouter } from '@tanstack/react-router';
import { Button } from '@/features/shared/components/ui/button';

export const BackButton = (props: React.ComponentProps<typeof Button>) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Button
      onClick={() => router.history.back()}
      {...props}
    >
      {t('common.go_back')}
    </Button>
  );
};
