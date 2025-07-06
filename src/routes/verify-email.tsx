import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { EmailVerificationForm } from '@/features/login/components/email-verification-form';

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
        {t('common.app_name')}
        <EmailVerificationForm />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/verify-email')({
  component: LoginPage,
});
