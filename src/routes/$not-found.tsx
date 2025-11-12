import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/features/shared/components/ui/button';

export const Route = createFileRoute('/$not-found')({
  component: NotFound,
});

function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-bold">{t('common.not_found')}</h1>
        <p className="text-muted-foreground">{t('common.page_doesnt_exist')}</p>
        <Button className="w-full mt-4" onClick={() => navigate({ to: '/' })}>
          {t('common.back_to_home')}
        </Button>
      </div>
    </div>
  );
}
