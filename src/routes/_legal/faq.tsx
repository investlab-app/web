import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_legal/faq')({
  component: () => (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Frequently Asked Questions</h1>
      <p>
        Here are answers to common questions about InvestLab. If you don’t find
        your answer here, feel free to contact us.
      </p>

      <h2>What is InvestLab?</h2>
      <p>
        InvestLab is a platform for simulating stock trading and portfolio
        management. It allows users to practice investing without real money
        while learning how markets and portfolios behave.
      </p>

      <h2>Is InvestLab free?</h2>
      <p>
        Yes. InvestLab is free to use for educational purposes. We may add
        optional premium features in the future, but the core platform will stay
        accessible.
      </p>

      <h2>Who can use InvestLab?</h2>
      <p>
        InvestLab is intended for users who are 18 years and older. Since it’s
        finance-related, we want to ensure a responsible educational experience.
      </p>

      <h2>Do I need real money to use InvestLab?</h2>
      <p>
        No. All activity in InvestLab is simulated. It’s designed as a safe way
        to practice without financial risk.
      </p>

      <h2>Is my data safe?</h2>
      <p>
        Yes. We take data security seriously. Authentication and account
        management are handled through{' '}
        <a href="https://clerk.com" target="_blank" rel="noopener">
          Clerk
        </a>
        , and usage insights are processed using{' '}
        <a href="https://posthog.com" target="_blank" rel="noopener">
          PostHog
        </a>{' '}
        analytics. For full details, see our{' '}
        <a href="/privacy-policy">Privacy Policy</a>.
      </p>

      <h2>Where is my data stored?</h2>
      <p>
        Data may be stored securely in the European Union and the United States,
        depending on which services we use. International transfers are
        safeguarded by Standard Contractual Clauses (GDPR compliant).
      </p>

      <h2>Can I delete my account?</h2>
      <p>
        Yes. You can request account deletion from your account settings or by
        contacting us at{' '}
        <a href="mailto:app.investlab@gmail.com">app.investlab@gmail.com</a>.
        Once deleted, your personal data will be removed unless we’re legally
        required to keep some records.
      </p>

      <h2>Does InvestLab offer real trading?</h2>
      <p>
        No. InvestLab is strictly a simulation and educational tool. Trades made
        on the platform are not executed in real markets and involve no real
        money.
      </p>

      <h2>Do I get investment advice here?</h2>
      <p>
        No. InvestLab does not provide financial or investment advice. It’s only
        intended as a practical learning environment to understand the basics of
        investing and portfolio management.
      </p>
    </div>
  ),
});
