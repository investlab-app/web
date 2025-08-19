import { createFileRoute } from '@tanstack/react-router';
import { type } from 'arktype';
import { LoginForm } from '@/features/auth/components/login-form';

export const Route = createFileRoute('/_auth/login')({
  component: Login,
  validateSearch: type({
    error: 'string?',
  }),
});

function Login() {
  const { error } = Route.useSearch();
  return <LoginForm pageError={error} />;
}
