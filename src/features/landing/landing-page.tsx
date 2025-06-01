// src/components/landing-page.tsx
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function LandingPage() {
  const navigate = useNavigate();
  const {t} = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{t("common.landing_text")}</h1>
      <Button onClick={() => navigate({ to: '/login-page' })}>{t("auth.login")}</Button>
    </div>
  );
}
