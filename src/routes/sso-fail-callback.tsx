import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function SsoCallback() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate({ to: '/' }); // redirect to your dashboard/home
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-bold">Sorry, the SSO login failed</h1>
        <p className="text-muted-foreground">
          If you never logged in to our page via SSO, try SSO signup instead.
        </p>
        <p className="text-muted-foreground">
          If you have logged in to our page via SSO before, do not use the SSO
          signup.
        </p>
        <Button className="w-full mt-4" onClick={() => navigate({ to: '/' })}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/sso-fail-callback')({
  component: SsoCallback,
});
