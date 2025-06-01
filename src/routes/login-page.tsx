import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { LoginForm } from '@/features/login/components/login-form';
import { useTranslation } from 'react-i18next';

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
      {t("common.app_name")}
        <LoginForm />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/login-page')({
  component: LoginPage,
});
