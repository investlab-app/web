import { createFileRoute } from '@tanstack/react-router';
import { type } from 'arktype';
import { LoginForm } from '@/features/auth/components/login-form';
import { AcceptTermsPrivacy } from '@/features/auth/components/accept-terms-privacy';

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
  validateSearch: type({
    error: 'string?',
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
