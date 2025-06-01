import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface AuthFormFooterProps {
  type: 'login' | 'signup';
  onBack?: () => void;
}

export function AuthFormFooter({ type, onBack }: AuthFormFooterProps) {
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
}
