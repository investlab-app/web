import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { SignUpForm } from '@/features/auth/components/signup-form';

export const Route = createFileRoute('/_auth/signup')({
  component: SignUpPage,
  validateSearch: z.object({
    error: z.string().optional(),
  }),
});

function SignUpPage() {
  const { error } = Route.useSearch();
  return <SignUpForm pageError={error} />;
}
