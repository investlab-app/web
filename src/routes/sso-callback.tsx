import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export default function SsoCallback() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate({ to: '/' }); // redirect to your dashboard/home
    }
  }, [isSignedIn, navigate]);

  return <div>Signing you in...</div>;
}

export const Route = createFileRoute('/sso-callback')({
  component: SsoCallback,
});
