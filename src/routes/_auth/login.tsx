import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { LoginForm } from '@/features/auth/components/login-form';

export const Route = createFileRoute('/_auth/login')({
  component: Login,
  validateSearch: z.object({
    error: z.string().optional(),
  }),
});

function Login() {
  const { error } = Route.useSearch();
  return <LoginForm pageError={error} />;
}
