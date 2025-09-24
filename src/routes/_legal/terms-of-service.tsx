import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

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
      <p>{t('legal.termsOfService.userEligibility.ageRequirement')}</p>
      <p>{t('legal.termsOfService.userEligibility.accountAccuracy')}</p>

      <h2>{t('legal.termsOfService.acceptanceOfTerms.title')}</h2>
      <p>{t('legal.termsOfService.acceptanceOfTerms.description')}</p>

      <h2>{t('legal.termsOfService.useLicense.title')}</h2>
      <p>{t('legal.termsOfService.useLicense.description')}</p>

      <h2>{t('legal.termsOfService.disclaimer.title')}</h2>
      <p>{t('legal.termsOfService.disclaimer.description')}</p>

      <h2>{t('legal.termsOfService.educationalDisclaimer.title')}</h2>
      <p>
        <strong>
          {t('legal.termsOfService.educationalDisclaimer.notice')}
        </strong>{' '}
        {t('legal.termsOfService.educationalDisclaimer.description')}
        <br />
        <br />
        {t('legal.termsOfService.educationalDisclaimer.asIsBasis')}
      </p>

      <h2>{t('legal.termsOfService.limitations.title')}</h2>
      <p>{t('legal.termsOfService.limitations.description')}</p>

      <h2>{t('legal.termsOfService.accuracyOfMaterials.title')}</h2>
      <p>{t('legal.termsOfService.accuracyOfMaterials.description')}</p>

      <h2>{t('legal.termsOfService.contactInformation.title')}</h2>
      <p>{t('legal.termsOfService.contactInformation.description')}</p>

      <h2>{t('legal.termsOfService.governingLaw.title')}</h2>
      <p>{t('legal.termsOfService.governingLaw.description')}</p>

      <h2>{t('legal.termsOfService.disputeResolution.title')}</h2>
      <p>{t('legal.termsOfService.disputeResolution.description')}</p>
    </div>
  );
}
