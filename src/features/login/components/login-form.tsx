import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import type { ClerkError } from '@/lib/clerk-error';
import { AuthFormContainer } from '@/features/login/components/auth-form-container';
import { AuthFormHeader } from '@/features/login/components/auth-form-header';
import { FormInput } from '@/components/ui/form-input';
import { SocialAuthButton } from '@/features/login/components/social-auth-button';
import { Divider } from '@/components/ui/divider';
import { AuthFormFooter } from '@/features/login/components/auth-form-footer';
import { Button } from '@/components/ui/button';
import { THIS_URL } from '@/lib/constants';

export function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setError(null);
    setLoading(true);

    try {
      const result = await signIn.create({
        strategy: 'password',
        identifier: email,
        password: password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        setLoading(false);
        navigate({ to: '/' });
      }
    } catch (err: unknown) {
      setLoading(false);
      console.error('Sign-in error:', (err as ClerkError).errors);
      setError(
        (err as ClerkError).errors[0]?.message || 'Something went wrong.'
      );
    }
  };

  const handleGoogleAuth = () => {
    signIn?.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrlComplete: `${THIS_URL}/sso-callback`,
      redirectUrl: `${THIS_URL}/sso-fail-callback`,
    });
  };

  return (
    <AuthFormContainer
      header={
        <AuthFormHeader
          title="Welcome back"
          description="Login with your Google account"
        />
      }
    >
      {loading && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <SocialAuthButton provider="google" onClick={handleGoogleAuth}>
          Login with Google
        </SocialAuthButton>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-6">
        <Divider text="Or continue with" />

        <div className="grid gap-6">
          <FormInput
            id="email"
            label="Email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            name="password"
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button autoFocus type="submit" className="w-full">
            Login
          </Button>

          <AuthFormFooter type="login" onBack={() => navigate({ to: '/' })} />
        </div>
      </form>
    </AuthFormContainer>
  );
}
