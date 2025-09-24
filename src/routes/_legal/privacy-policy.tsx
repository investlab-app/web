import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

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

      <p>{t('legal.privacyPolicy.intro.description')}</p>
      <p>{t('legal.privacyPolicy.intro.agreement')}</p>

      <h2>{t('legal.privacyPolicy.interpretationDefinitions.title')}</h2>

      <h3>
        {t(
          'legal.privacyPolicy.interpretationDefinitions.interpretation.title'
        )}
      </h3>
      <p>
        {t(
          'legal.privacyPolicy.interpretationDefinitions.interpretation.description'
        )}
      </p>

      <h3>
        {t('legal.privacyPolicy.interpretationDefinitions.definitions.title')}
      </h3>
      <ul>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.account.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.account.description'
          )}
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.affiliate.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.affiliate.description'
          )}
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.company.term'
            )}
          </strong>{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.company.description'
          )}
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.cookies.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.cookies.description'
          )}
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.country.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.country.description'
          )}
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.device.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.device.description'
          )}
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.personalData.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.personalData.description'
          )}
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.service.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.service.description'
          )}
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.serviceProvider.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.serviceProvider.description'
          )}
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.thirdPartySocial.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.thirdPartySocial.description'
          )}
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.usageData.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.usageData.description'
          )}
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.website.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.website.description'
          )}
          <a href="https://investlab.app/" target="_blank" rel="noopener">
            https://investlab.app/
          </a>
          .
        </li>
        <li>
          <strong>
            {t(
              'legal.privacyPolicy.interpretationDefinitions.definitions.you.term'
            )}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.interpretationDefinitions.definitions.you.description'
          )}
        </li>
      </ul>

      <h2>{t('legal.privacyPolicy.collectingData.title')}</h2>
      <h3>{t('legal.privacyPolicy.collectingData.typesOfData.title')}</h3>

      <h4>{t('legal.privacyPolicy.collectingData.personalData.title')}</h4>
      <p>{t('legal.privacyPolicy.collectingData.personalData.description')}</p>
      <ul>
        <li>{t('legal.privacyPolicy.collectingData.personalData.email')}</li>
        <li>{t('legal.privacyPolicy.collectingData.personalData.name')}</li>
        <li>
          {t('legal.privacyPolicy.collectingData.personalData.usageData')}
        </li>
      </ul>

      <h4>{t('legal.privacyPolicy.collectingData.usageData.title')}</h4>
      <p>{t('legal.privacyPolicy.collectingData.usageData.description')}</p>

      <h4>{t('legal.privacyPolicy.collectingData.thirdParty.title')}</h4>
      <p>{t('legal.privacyPolicy.collectingData.thirdParty.description')}</p>

      <h4>{t('legal.privacyPolicy.collectingData.cookies.title')}</h4>
      <p>{t('legal.privacyPolicy.collectingData.cookies.description')}</p>
      <ul>
        <li>
          <strong>
            {t('legal.privacyPolicy.collectingData.cookies.essential.title')}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.collectingData.cookies.essential.description'
          )}
          <a href="https://clerk.com" target="_blank" rel="noopener">
            Clerk
          </a>
          {t('legal.privacyPolicy.collectingData.cookies.essential.suffix')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.collectingData.cookies.analytics.title')}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.collectingData.cookies.analytics.description'
          )}
          <a href="https://posthog.com" target="_blank" rel="noopener">
            PostHog
          </a>
          {t('legal.privacyPolicy.collectingData.cookies.analytics.suffix')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.collectingData.cookies.preference.title')}
          </strong>{' '}
          –{' '}
          {t(
            'legal.privacyPolicy.collectingData.cookies.preference.description'
          )}
        </li>
      </ul>
      <p>{t('legal.privacyPolicy.collectingData.cookies.browserSettings')}</p>

      <h3>{t('legal.privacyPolicy.useOfData.title')}</h3>
      <p>{t('legal.privacyPolicy.useOfData.description')}</p>
      <ul>
        <li>
          <strong>
            {t('legal.privacyPolicy.useOfData.purposes.provide.title')}
          </strong>
          {t('legal.privacyPolicy.useOfData.purposes.provide.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.useOfData.purposes.manage.title')}
          </strong>
          {t('legal.privacyPolicy.useOfData.purposes.manage.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.useOfData.purposes.contract.title')}
          </strong>
          {t('legal.privacyPolicy.useOfData.purposes.contract.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.useOfData.purposes.contact.title')}
          </strong>
          {t('legal.privacyPolicy.useOfData.purposes.contact.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.useOfData.purposes.news.title')}
          </strong>{' '}
          {t('legal.privacyPolicy.useOfData.purposes.news.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.useOfData.purposes.requests.title')}
          </strong>{' '}
          {t('legal.privacyPolicy.useOfData.purposes.requests.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.useOfData.purposes.transfers.title')}
          </strong>{' '}
          {t('legal.privacyPolicy.useOfData.purposes.transfers.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.useOfData.purposes.analytics.title')}
          </strong>{' '}
          {t('legal.privacyPolicy.useOfData.purposes.analytics.description')}
        </li>
      </ul>

      <p>{t('legal.privacyPolicy.sharingData.description')}</p>
      <ul>
        <li>
          <strong>
            {t('legal.privacyPolicy.sharingData.authProviders.title')}
          </strong>
          <a href="https://clerk.com" target="_blank" rel="noopener">
            Clerk
          </a>
          {t('legal.privacyPolicy.sharingData.authProviders.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.sharingData.analyticsProviders.title')}
          </strong>
          <a href="https://posthog.com" target="_blank" rel="noopener">
            PostHog
          </a>
          {t('legal.privacyPolicy.sharingData.analyticsProviders.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.sharingData.otherProviders.title')}
          </strong>{' '}
          – {t('legal.privacyPolicy.sharingData.otherProviders.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.sharingData.businessTransfers.title')}
          </strong>
          {t('legal.privacyPolicy.sharingData.businessTransfers.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.sharingData.affiliates.title')}
          </strong>
          {t('legal.privacyPolicy.sharingData.affiliates.description')}
        </li>
        <li>
          <strong>{t('legal.privacyPolicy.sharingData.partners.title')}</strong>{' '}
          {t('legal.privacyPolicy.sharingData.partners.description')}
        </li>
        <li>
          <strong>{t('legal.privacyPolicy.sharingData.users.title')}</strong>
          {t('legal.privacyPolicy.sharingData.users.description')}
        </li>
        <li>
          <strong>{t('legal.privacyPolicy.sharingData.consent.title')}</strong>
          {t('legal.privacyPolicy.sharingData.consent.description')}
        </li>
      </ul>

      <h3>{t('legal.privacyPolicy.retention.title')}</h3>
      <p>{t('legal.privacyPolicy.retention.description')}</p>

      <h3>{t('legal.privacyPolicy.transfer.title')}</h3>
      <p>{t('legal.privacyPolicy.transfer.description')}</p>

      <h3>{t('legal.privacyPolicy.delete.title')}</h3>
      <p>{t('legal.privacyPolicy.delete.description')}</p>

      <h3>{t('legal.privacyPolicy.disclosure.title')}</h3>
      <h4>{t('legal.privacyPolicy.disclosure.businessTransactions.title')}</h4>
      <p>
        {t('legal.privacyPolicy.disclosure.businessTransactions.description')}
      </p>
      <h4>{t('legal.privacyPolicy.disclosure.lawEnforcement.title')}</h4>
      <p>{t('legal.privacyPolicy.disclosure.lawEnforcement.description')}</p>
      <h4>{t('legal.privacyPolicy.disclosure.otherLegal.title')}</h4>
      <p>{t('legal.privacyPolicy.disclosure.otherLegal.description')}</p>

      <h3>{t('legal.privacyPolicy.security.title')}</h3>
      <p>{t('legal.privacyPolicy.security.description')}</p>

      <h2>{t('legal.privacyPolicy.gdpr.title')}</h2>
      <p>{t('legal.privacyPolicy.gdpr.description')}</p>

      <h3>{t('legal.privacyPolicy.gdpr.lawfulBases.title')}</h3>
      <ul>
        <li>
          <strong>
            {t('legal.privacyPolicy.gdpr.lawfulBases.contract.title')}
          </strong>{' '}
          – {t('legal.privacyPolicy.gdpr.lawfulBases.contract.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.gdpr.lawfulBases.consent.title')}
          </strong>{' '}
          – {t('legal.privacyPolicy.gdpr.lawfulBases.consent.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.gdpr.lawfulBases.legitimate.title')}
          </strong>{' '}
          – {t('legal.privacyPolicy.gdpr.lawfulBases.legitimate.description')}
        </li>
        <li>
          <strong>
            {t('legal.privacyPolicy.gdpr.lawfulBases.legal.title')}
          </strong>{' '}
          – {t('legal.privacyPolicy.gdpr.lawfulBases.legal.description')}
        </li>
      </ul>

      <h3>{t('legal.privacyPolicy.gdpr.transfers.title')}</h3>
      <p>{t('legal.privacyPolicy.gdpr.transfers.description')}</p>

      <h3>{t('legal.privacyPolicy.gdpr.rights.title')}</h3>
      <ul>
        <li>{t('legal.privacyPolicy.gdpr.rights.access')}</li>
        <li>{t('legal.privacyPolicy.gdpr.rights.correct')}</li>
        <li>{t('legal.privacyPolicy.gdpr.rights.delete')}</li>
        <li>{t('legal.privacyPolicy.gdpr.rights.restrict')}</li>
        <li>{t('legal.privacyPolicy.gdpr.rights.portability')}</li>
        <li>{t('legal.privacyPolicy.gdpr.rights.withdraw')}</li>
        <li>{t('legal.privacyPolicy.gdpr.rights.complaint')}</li>
      </ul>

      <h3>{t('legal.privacyPolicy.gdpr.children.title')}</h3>
      <p>{t('legal.privacyPolicy.gdpr.children.description')}</p>

      <h3>{t('legal.privacyPolicy.gdpr.contact.title')}</h3>
      <ul>
        <li>
          {t('legal.privacyPolicy.gdpr.contact.email')}{' '}
          <a href="mailto:app.investlab@gmail.com">app.investlab@gmail.com</a>
        </li>
      </ul>

      <h2>{t('legal.privacyPolicy.links.title')}</h2>
      <p>{t('legal.privacyPolicy.links.description')}</p>

      <h2>{t('legal.privacyPolicy.changes.title')}</h2>
      <p>{t('legal.privacyPolicy.changes.description')}</p>

      <h2>{t('legal.privacyPolicy.contact.title')}</h2>
      <p>{t('legal.privacyPolicy.contact.description')}</p>
      <ul>
        <li>
          {t('legal.privacyPolicy.contact.email')}{' '}
          <a href="mailto:app.investlab@gmail.com">app.investlab@gmail.com</a>
        </li>
      </ul>
    </div>
  );
}
