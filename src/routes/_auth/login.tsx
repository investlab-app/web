import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { LoginForm } from '@/features/auth/components/login-form';
import { AcceptTermsPrivacy } from '@/features/auth/components/accept-terms-privacy';

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
  validateSearch: z.object({
    error: z.string().optional(),
  }),
});

function RouteComponent() {
  const { error } = Route.useSearch();
  return (
    <>
      <LoginForm pageError={error} />
      <AcceptTermsPrivacy />
    </>
  );
}
