import { createFileRoute } from '@tanstack/react-router';
import { type } from 'arktype';
import { SignUpForm } from '@/features/auth/components/signup-form';

export const Route = createFileRoute('/_auth/signup')({
  component: SignUpPage,
  validateSearch: type({
    error: 'string?',
  }),
});

function SignUpPage() {
  const { error } = Route.useSearch();
  return <SignUpForm pageError={error} />;
}
