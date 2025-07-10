import { createFileRoute } from '@tanstack/react-router';
import { type } from 'arktype';
import { EmailVerificationForm } from '@/features/auth/components/email-verification-form';

const VerifyEmailPage = () => {
  const { error } = Route.useSearch();
  return <EmailVerificationForm pageError={error} />;
};

export const Route = createFileRoute('/_auth/verify-email')({
  component: VerifyEmailPage,
  validateSearch: type({
    error: 'string?',
  }),
});
