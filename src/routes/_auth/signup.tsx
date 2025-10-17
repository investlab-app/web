import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { SignUpForm } from '@/features/auth/components/signup-form';
import { AcceptTermsPrivacy } from '@/features/auth/components/accept-terms-privacy';

export const Route = createFileRoute('/_auth/signup')({
  component: RouteComponent,
  validateSearch: z.object({
    error: z.string().optional(),
  }),
});

function RouteComponent() {
  const { error } = Route.useSearch();
  return (
    <>
      <SignUpForm pageError={error} />
      <AcceptTermsPrivacy />
    </>
  );
}
