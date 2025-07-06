import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';

interface RootProps {
  children: ReactNode;
}

const Root = ({ children }: RootProps) => (
  <Card className="flex flex-col gap-6">{children}</Card>
);

interface HeaderProps {
  title: string;
  description: string;
}

const Header = ({ title, description }: HeaderProps) => (
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
);

interface ContentProps {
  children: ReactNode;
}

const Content = ({ children }: ContentProps) => (
  <CardContent>{children}</CardContent>
);

interface FooterProps {
  type: 'login' | 'signup';
  onBack?: () => void;
}

const Footer = ({ type, onBack }: FooterProps) => {
  const { t } = useTranslation();

  const { oppositeType, text, actionText } = (() => {
    switch (type) {
      case 'login':
        return {
          oppositeType: 'signup' as const,
          text: t('auth.dont_have_an_account'),
          actionText: t('auth.signup'),
        };
      case 'signup':
        return {
          oppositeType: 'login' as const,
          text: t('auth.already_have_an_account'),
          actionText: t('auth.login'),
        };
    }
  })();

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

export const AuthForm = {
  Root,
  Header,
  Content,
  Footer,
};
