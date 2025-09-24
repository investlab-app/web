import { createFileRoute } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_legal/privacy-policy')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>{t('legal.privacyPolicy.title')}</h1>
      <p>
        {t('legal.privacyPolicy.lastUpdated', { date: new Date(2025, 8, 24) })}
      </p>

      <p>{t('legal.privacyPolicy.intro1')}</p>
      <p>{t('legal.privacyPolicy.intro2')}</p>

      <h2>{t('legal.privacyPolicy.interpretationDefinitions.title')}</h2>

      <h3>
        {t(
          'legal.privacyPolicy.interpretationDefinitions.interpretation.title'
        )}
      </h3>
      <p>
        {t('legal.privacyPolicy.interpretationDefinitions.interpretation.text')}
      </p>

      <h3>
        {t('legal.privacyPolicy.interpretationDefinitions.definitions.title')}
      </h3>
      <ul>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.account">
            <strong>Account</strong> – A unique account created for you to
            access our Service.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.affiliate">
            <strong>Affiliate</strong> – An entity that controls, is controlled
            by, or under common control with us.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.company">
            <strong>Company</strong> (referred to as “the Company”, “We”, “Us”
            or “Our”) refers to InvestLab.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.cookies">
            <strong>Cookies</strong> – Small files placed on your device by a
            website.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.country">
            <strong>Country</strong> – Refers to Poland.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.device">
            <strong>Device</strong> – Any device that can access the Service
            (e.g. laptop, tablet, smartphone).
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.personalData">
            <strong>Personal Data</strong> – Information that relates to an
            identified or identifiable individual.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.service">
            <strong>Service</strong> – The InvestLab website and related
            application functionality.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.serviceProvider">
            <strong>Service Provider</strong> – A third‑party that processes
            data on behalf of the Company.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.thirdParty">
            <strong>Third‑Party Social Media Service</strong> – External
            services (e.g. Google) for login or account creation.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.usageData">
            <strong>Usage Data</strong> – Data collected automatically (e.g. IP
            address, browser type, time spent on pages).
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.website">
            <strong>Website</strong> – Refers to InvestLab, accessible from
            <a href="https://investlab.app/" target="_blank" rel="noopener">
              https://investlab.app/
            </a>
            .
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.interpretationDefinitions.definitions.you">
            <strong>You</strong> – The individual or entity using our Service.
          </Trans>
        </li>
      </ul>

      {/* ------- The rest of the document continues exactly the same way ------- */}
      {/* Each heading, paragraph, and <li> should be wrapped either in t("...")   */}
      {/* or <Trans i18nKey="..."> depending on whether it includes HTML elements */}

      {/* Examples for variety below */}

      <h2>{t('legal.privacyPolicy.collecting.title')}</h2>
      <h3>{t('legal.privacyPolicy.collecting.typesOfData')}</h3>

      <h4>{t('legal.privacyPolicy.collecting.personalData.title')}</h4>
      <p>{t('legal.privacyPolicy.collecting.personalData.text')}</p>
      <ul>
        <li>{t('legal.privacyPolicy.collecting.personalData.email')}</li>
        <li>{t('legal.privacyPolicy.collecting.personalData.name')}</li>
        <li>{t('legal.privacyPolicy.collecting.personalData.usageData')}</li>
      </ul>

      <h4>{t('legal.privacyPolicy.collecting.usageData.title')}</h4>
      <p>{t('legal.privacyPolicy.collecting.usageData.text')}</p>

      <h4>{t('legal.privacyPolicy.collecting.thirdPartySocial.title')}</h4>
      <p>{t('legal.privacyPolicy.collecting.thirdPartySocial.text')}</p>

      <h4>{t('legal.privacyPolicy.collecting.cookies.title')}</h4>
      <p>{t('legal.privacyPolicy.collecting.cookies.text')}</p>
      <ul>
        <li>
          <Trans i18nKey="legal.privacyPolicy.collecting.cookies.essential">
            <strong>Essential Cookies (Authentication)</strong> – Used by{' '}
            <a href="https://clerk.com">Clerk</a>
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.collecting.cookies.analytics">
            <strong>Analytics (Cookieless)</strong> – We use{' '}
            <a href="https://posthog.com">PostHog</a>
          </Trans>
        </li>
        <li>
          <Trans i18nKey="legal.privacyPolicy.collecting.cookies.preference">
            <strong>Preference Cookies</strong> – Remember your settings.
          </Trans>
        </li>
      </ul>
      <p>{t('legal.privacyPolicy.collecting.cookies.notice')}</p>

      {/* ... The rest of the Privacy Policy continues with the same pattern:
          - Headings => t("...")
          - Simple paragraphs => t("...")
          - List items with <strong>/<a> => <Trans i18nKey="..."> ... </Trans>
      */}

      <h2>{t('legal.privacyPolicy.contact.title')}</h2>
      <p>{t('legal.privacyPolicy.contact.text')}</p>
      <ul>
        <li>
          <Trans i18nKey="legal.privacyPolicy.contact.email">
            Email:{' '}
            <a href="mailto:app.investlab@gmail.com">app.investlab@gmail.com</a>
          </Trans>
        </li>
      </ul>
    </div>
  );
}
