// src/routes/$not-found.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-bold">404 - Not Found</h1>
        <p className="text-muted-foreground">This page doesn't exist.</p>
        <Button className="w-full mt-4" onClick={() => navigate({ to: '/' })}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/$not-found')({
  component: NotFoundPage,
});
