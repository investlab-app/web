import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_legal/faq')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>{t('legal.faq.title')}</h1>
      <p>{t('legal.faq.intro')}</p>

      <h2>{t('legal.faq.q1.question')}</h2>
      <p>{t('legal.faq.q1.answer')}</p>

      <h2>{t('legal.faq.q2.question')}</h2>
      <p>{t('legal.faq.q2.answer')}</p>

      <h2>{t('legal.faq.q3.question')}</h2>
      <p>{t('legal.faq.q3.answer')}</p>

      <h2>{t('legal.faq.q4.question')}</h2>
      <p>{t('legal.faq.q4.answer')}</p>

      <h2>{t('legal.faq.q5.question')}</h2>
      <p>
        {t('legal.faq.q5.answer.part1')}{' '}
        <a href="https://clerk.com" target="_blank" rel="noopener">
          Clerk
        </a>
        {t('legal.faq.q5.answer.part2')}{' '}
        <a href="https://posthog.com" target="_blank" rel="noopener">
          PostHog
        </a>{' '}
        {t('legal.faq.q5.answer.part3')}{' '}
        <a href="/privacy-policy">{t('common.privacy_policy')}</a>.
      </p>

      <h2>{t('legal.faq.q6.question')}</h2>
      <p>{t('legal.faq.q6.answer')}</p>

      <h2>{t('legal.faq.q7.question')}</h2>
      <p>
        {t('legal.faq.q7.answer.part1')}{' '}
        <a href="mailto:app.investlab@gmail.com">app.investlab@gmail.com</a>.
        {t('legal.faq.q7.answer.part2')}
      </p>

      <h2>{t('legal.faq.q8.question')}</h2>
      <p>{t('legal.faq.q8.answer')}</p>

      <h2>{t('legal.faq.q9.question')}</h2>
      <p>{t('legal.faq.q9.answer')}</p>
    </div>
  );
}
