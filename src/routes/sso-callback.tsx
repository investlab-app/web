import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export default function SsoCallback() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate({ to: '/' });
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-bold">Signing you in...</h1>
        <p className="text-muted-foreground">Give us a sec, please</p>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/sso-callback')({
  component: SsoCallback,
});
