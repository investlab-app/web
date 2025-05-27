// src/components/landing-page.tsx
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Hello 👋 Welcome to Our App!</h1>
      <Button onClick={() => navigate({ to: '/login-page' })}>Sign In</Button>
    </div>
  );
}
