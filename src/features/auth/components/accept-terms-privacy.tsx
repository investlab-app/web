import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export function AcceptTermsPrivacy() {
  const { t } = useTranslation();
  return (
    <p className="text-muted-foreground px-8 text-center text-sm">
      {t('auth.acceptTermsPrivacy.byClickingContinueYouAgreeToOur')}{' '}
      <Link
        to="/terms-of-service"
        className="hover:text-primary underline underline-offset-4"
      >
        {t('auth.acceptTermsPrivacy.termsOfService')}
      </Link>{' '}
      {t('auth.acceptTermsPrivacy.and')}{' '}
      <Link
        to="/privacy-policy"
        className="hover:text-primary underline underline-offset-4"
      >
        {t('auth.acceptTermsPrivacy.privacyPolicy')}
      </Link>
      .
    </p>
  );
}
