import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SignIn, useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { type } from 'arktype';
import { LoginForm } from '@/features/auth/components/login-form';
import { InvestLabLogo } from '@/features/shared/components/investlab-logo';

function Login() {
  const { isLoaded, isSignedIn } = useUser();
  const { t } = useTranslation();
  const { error } = Route.useSearch();
  const navigate = useNavigate();

  if (isLoaded && isSignedIn) {
    navigate({ to: '/', replace: true });
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="relative overflow-hidden min-h-svh">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-purple-800/15 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-purple-800/25" />
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <div className="flex items-center justify-center gap-3">
              <InvestLabLogo className="!size-8" width={32} height={32} />
              <span className="text-2xl font-semibold">
                {t('common.app_name')}
              </span>
            </div>
            {/* todo: Make this nicer :( */}
            {error && <p className="text-red-500">{error}</p>}
            <SignIn />
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/login')({
  component: Login,
  validateSearch: type({
    error: 'string?',
  }),
});
