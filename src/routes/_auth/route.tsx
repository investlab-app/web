import { useUser } from '@clerk/clerk-react';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { InvestLabLogo } from '@/features/shared/components/investlab-logo';

function RouteComponent() {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isLoaded && isSignedIn) {
    navigate({ to: '/', replace: true });
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-purple-800/15 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-purple-800/25">
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="flex items-center gap-2 py-6">
          <InvestLabLogo className="size-8" width={32} height={32} />
          <span className="text-2xl font-bold text-foreground">
            {t('common.app_name')}
          </span>
        </div>
        <div className="w-full max-w-sm flex flex-col gap-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
});
