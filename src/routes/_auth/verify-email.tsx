import { createFileRoute } from '@tanstack/react-router';
import { type } from 'arktype';
import { EmailVerificationForm } from '@/features/auth/components/email-verification-form';

export const Route = createFileRoute('/_auth/verify-email')({
  component: VerifyEmail,
  validateSearch: type({
    error: 'string?',
  }),
});

function VerifyEmail() {
  const { error } = Route.useSearch();
  return <EmailVerificationForm pageError={error} />;
}
