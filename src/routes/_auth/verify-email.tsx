import { createFileRoute } from '@tanstack/react-router';
import { EmailVerificationForm } from '@/features/auth/components/email-verification-form';

const VerifyEmailPage = () => {
  return <EmailVerificationForm />;
};

export const Route = createFileRoute('/_auth/verify-email')({
  component: VerifyEmailPage,
});
