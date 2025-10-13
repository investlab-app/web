import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { EmailVerificationForm } from '@/features/auth/components/email-verification-form';

export const Route = createFileRoute('/_auth/verify-email')({
  component: RouteComponent,
  validateSearch: z.object({
    error: z.string().optional(),
  }),
});

function RouteComponent() {
  const { error } = Route.useSearch();
  return <EmailVerificationForm pageError={error} />;
}
