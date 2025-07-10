import { createFileRoute } from '@tanstack/react-router';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { LoadingSpinner } from '@/features/shared/components/ui/loading-spinner';

const SSOCallback = () => {
  return (
    <>
      <AuthenticateWithRedirectCallback />
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center gap-2 border-b-0">
          <LoadingSpinner className="w-8 h-8 text-neutral-100 mb-2" />
          <CardTitle className="text-lg text-neutral-100 mb-1">
            Processing SSO Callback
          </CardTitle>
          <CardDescription className="text-neutral-400 text-center max-w-xs">
            Please wait while we sign you in securely with your provider.
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  );
};

export const Route = createFileRoute('/_auth/sso-callback')({
  component: SSOCallback,
});
