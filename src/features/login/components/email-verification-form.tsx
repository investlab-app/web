// src/components/email-verification-form.tsx
import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import type { ClerkError } from '@/features/login/clerk-error';
import { Button } from '@/features/shared/components/ui/button';
import { SixDigitOTPInput } from '@/features/shared/components/ui/six-digit-otp-input';
import { AuthForm } from '@/features/login/components/auth-form';

export function EmailVerificationForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate({ to: '/' });
      }
    } catch (err: unknown) {
      setError(
        (err as ClerkError).errors[0]?.message || 'Something went wrong.'
      );
    }
  };

  return (
    <AuthForm>
      <AuthForm.Header
        title="Verify your email"
        description="Enter the code sent to your email"
      />
      <AuthForm.Content>
        <form onSubmit={handleCodeSubmit} className="grid gap-6">
          <div className="flex justify-center">
            <SixDigitOTPInput value={code} onChange={setCode} />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" disabled={code.length < 6} className="w-full">
            Verify Email
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            type="button"
            onClick={() => navigate({ to: '/signup-page' })}
          >
            Go Back
          </Button>
        </form>
      </AuthForm.Content>
    </AuthForm>
  );
}
