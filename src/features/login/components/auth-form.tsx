import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';

type AuthFormProps = PropsWithChildren;

export const AuthForm = ({ children }: AuthFormProps) => (
  <Card className="flex flex-col gap-6">{children}</Card>
);

AuthForm.Header = function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};

AuthForm.Content = ({ children }: { children: ReactNode }) => {
  return <CardContent>{children}</CardContent>;
};

interface AuthFormFooterProps {
  type: 'login' | 'signup';
  onBack?: () => void;
}

AuthForm.Footer = function Footer({ type, onBack }: AuthFormFooterProps) {
  const oppositeType = type === 'login' ? 'signup' : 'login';
  const { t } = useTranslation();
  const text =
    type === 'login'
      ? t('auth.dont_have_an_account')
      : t('auth.already_have_an_account');
  const actionText = type === 'login' ? t('auth.signup') : t('auth.login');

  return (
    <div className="grid gap-4">
      <Button variant="ghost" className="w-full" onClick={onBack} type="button">
        {t('common.go_back')}
      </Button>
      <div className="text-center text-sm">
        {text}{' '}
        <Link
          to={`/${oppositeType}-page`}
          className="underline underline-offset-4"
        >
          {actionText}
        </Link>
      </div>
    </div>
  );
};
