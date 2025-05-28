
import { createFileRoute, redirect } from '@tanstack/react-router';
import { SignUpForm } from '@/components/signup-form';
import { isAuthenticated } from '@/lib/auth';

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        
          Our stocks app with no specified name
        
        <SignUpForm />
      </div>
    </div>
  );
}
export const Route = createFileRoute('/signup-page')({
  beforeLoad: async () => {
    const isAuth = await isAuthenticated();
    if (isAuth) throw redirect({ to: "/" });
  },
  component: SignUpPage,
});
