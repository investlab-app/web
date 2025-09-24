import { createFileRoute } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_legal/terms-of-service')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>{t('legal.termsOfService.title')}</h1>
      <p>
        {t('legal.termsOfService.lastUpdated', { date: new Date(2025, 8, 24) })}
      </p>

      <h2>{t('legal.termsOfService.userEligibility.title')}</h2>
      <p>{t('legal.termsOfService.userEligibility.text1')}</p>
      <p>{t('legal.termsOfService.userEligibility.text2')}</p>

      <h2>{t('legal.termsOfService.acceptance.title')}</h2>
      <p>
        <Trans i18nKey="legal.termsOfService.acceptance.text">
          By accessing the platform at{' '}
          <a href="http://www.investlab.app">http://www.investlab.app</a>, you
          are agreeing to be bound by these terms of service...
        </Trans>
      </p>

      <h2>{t('legal.termsOfService.useLicense.title')}</h2>
      <p>{t('legal.termsOfService.useLicense.text')}</p>

      <h2>{t('legal.termsOfService.disclaimer.title')}</h2>
      <p>{t('legal.termsOfService.disclaimer.text')}</p>

      <h2>{t('legal.termsOfService.educationalDisclaimer.title')}</h2>
      <p>
        <Trans i18nKey="legal.termsOfService.educationalDisclaimer.text">
          <strong>IMPORTANT NOTICE:</strong> This platform is for educational
          and informational purposes only and simulates paper trading without
          involving real money...
        </Trans>
      </p>

      <h2>{t('legal.termsOfService.limitations.title')}</h2>
      <p>{t('legal.termsOfService.limitations.text')}</p>

      <h2>{t('legal.termsOfService.accuracy.title')}</h2>
      <p>{t('legal.termsOfService.accuracy.text')}</p>

      <h2>{t('legal.termsOfService.contact.title')}</h2>
      <p>
        <Trans i18nKey="legal.termsOfService.contact.text">
          For any questions about these Terms of Service, please contact us at:{' '}
          <a href="mailto:app-investlab@gmail.com">app-investlab@gmail.com</a>
        </Trans>
      </p>

      <h2>{t('legal.termsOfService.governingLaw.title')}</h2>
      <p>{t('legal.termsOfService.governingLaw.text')}</p>

      <h2>{t('legal.termsOfService.dispute.title')}</h2>
      <p>{t('legal.termsOfService.dispute.text')}</p>
    </div>
  );
}
