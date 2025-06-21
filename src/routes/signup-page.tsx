import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SignUpForm } from '@/features/login/components/signup-form';
import { InvestLabLogo } from '@/features/shared/components/investlab-logo';

export default function SignUpPage() {
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
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-purple-800/15 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-purple-800/25" />

        <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <div className="flex items-center justify-center gap-3">
              <InvestLabLogo className="!size-8" width={32} height={32} />
              <span className="text-2xl font-bold text-foreground">
                {t('common.app_name')}
              </span>
            </div>
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/signup-page')({
  component: SignUpPage,
});
