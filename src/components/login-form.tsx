import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { AuthFormContainer } from '@/components/auth-form-container';
import { AuthFormHeader } from '@/components/auth-form-header';
import { FormInput } from '@/components/ui/form-input';
import { SocialAuthButton } from '@/components/ui/social-auth-button';
import { Divider } from '@/components/ui/divider';
import { AuthFormFooter } from '@/components/auth-form-footer';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded ) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;


    setLoading(true);

    try {
      const result = await signIn.create({
        strategy: 'password',
        identifier: email,
        password: password,
      });

      if (result.status === 'complete') {
        setLoading(false);
        await setActive({ session: result.createdSessionId });
        navigate({ to: '/' });
      }
    } catch (err: unknown) {
      console.error('Sign-in error:', err.errors);
      setError(err.errors?.[0]?.message || 'Something went wrong.');
    }
  };

  const handleGoogleAuth = () => {
    signIn?.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrlComplete: 'http://localhost:3000/sso-callback',
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

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="flex flex-col gap-4">
          <SocialAuthButton provider="google" onClick={handleGoogleAuth}>
            Login with Google
          </SocialAuthButton>
        </div>

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

          <Button type="submit" className="w-full">
            Login
          </Button>

          <AuthFormFooter type="login" onBack={() => navigate({ to: '/' })} />
        </div>
      </form>
    </AuthFormContainer>
  );
}
