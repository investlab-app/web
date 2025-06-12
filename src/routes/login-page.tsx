import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '@/features/login/components/login-form';
import { InvestLabLogo } from '@/components/investlab-logo';

export default function LoginPage() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate({ to: '/' });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || isSignedIn) return null;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center justify-center gap-2">
          <InvestLabLogo className="!size-6" width={24} height={24} />
          <span className="text-xl font-semibold">{t('common.app_name')}</span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/login-page')({
  component: LoginPage,
});
