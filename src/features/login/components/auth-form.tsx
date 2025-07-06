import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from '@tanstack/react-router';
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
        <Link to={`/${oppositeType}`} className="underline underline-offset-4">
          {actionText}
        </Link>
      </div>
    </div>
  );
};

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => navigate({ to: '..' })}
      className="w-full"
    >
      Go Back
    </Button>
  );
};

interface ErrorProps {
  error: string;
}

const Error = ({ error }: ErrorProps) => (
  <p className="text-red-600 text-sm">{error}</p>
);

const Spinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current" />
);

const icons = {
  google: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        fill="currentColor"
      />
    </svg>
  ),
};

interface SocialAuthButtonProps {
  provider: 'google';
  onClick: () => void;
  children: ReactNode;
}

export const SocialAuthButton = ({
  provider,
  onClick,
  children,
}: SocialAuthButtonProps) => (
  <Button variant="outline" className="w-full" onClick={onClick}>
    {icons[provider]}
    <span className="ml-2">{children}</span>
  </Button>
);

interface GoogleButtonProps {
  onClick: () => void;
  type: 'login' | 'signup';
}

export const GoogleButton = ({ onClick, type }: GoogleButtonProps) => {
  const { t } = useTranslation();
  return (
    <SocialAuthButton provider="google" onClick={onClick}>
      {type === 'signup' && t('auth.signup_w_google')}
      {type === 'login' && t('auth.login_w_google')}
    </SocialAuthButton>
  );
};

export const AuthForm = {
  Root,
  Header,
  Content,
  Footer,
  BackButton,
  Error,
  Spinner,
  SocialAuthButton,
  GoogleButton,
};
