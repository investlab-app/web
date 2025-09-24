import { createFileRoute } from '@tanstack/react-router';
import { type } from 'arktype';
import { SignUpForm } from '@/features/auth/components/signup-form';

export const Route = createFileRoute('/_auth/signup')({
  component: RouteComponent,
  validateSearch: type({
    error: 'string?',
  }),
});

function RouteComponent() {
  const { error } = Route.useSearch();
  return <SignUpForm pageError={error} />;
}
