import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ResultAsync } from 'neverthrow';
import { ArkErrors, type } from 'arktype';
import { useAppForm } from '../../shared/hooks/use-app-form';
import type { ClerkError } from '@/features/login/utils/clerk-error';
import { GoogleAuth } from '@/features/login/components/google-auth';
import { AuthForm } from '@/features/login/components/auth-form';
import { FormInput } from '@/features/shared/components/ui/form-input';
import { Divider } from '@/features/shared/components/ui/divider';
import { Button } from '@/features/shared/components/ui/button';
import { PasswordInput } from '@/features/shared/components/ui/password-input';

export function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const emailForm = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: type({
        email: 'string',
        password: 'string > 7 & /[A-Z]/ & /[a-z]/ & /[0-9]/ & /[^A-Za-z0-9]/',
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      if (!isLoaded) {
        return formApi.setErrorMap({
          onSubmit: {
            ...formApi.getAllErrors(),
            form: 'Please try again later.',
          },
        });
      }

      const result = await ResultAsync.fromPromise(
        signIn.create({
          strategy: 'password',
          identifier: value.email,
          password: value.password,
        }),
        (err): ClerkError => ({
          type: 'clerk',
          error:
            err instanceof Error ? err : new Error('Could not verify email.'),
        })
      );

      return result.match(
        (resource) => {
          switch (resource.status) {
            case 'complete':
              setActive({ session: resource.createdSessionId });
              navigate({ to: '/' });
              break;
            case 'needs_first_factor':
              return 'First factor authentication required. Please check your email or phone for verification.';
            case 'needs_second_factor':
              return 'Two-factor authentication required. Please enter your verification code.';
            case 'needs_identifier':
              return 'Additional identification required. Please provide the requested information.';
            default:
              return 'Additional verification required. Please follow the instructions to complete sign-in.';
          }
        },
        (error) => {
          return formApi.setErrorMap({
            onSubmit: {
              ...formApi.getAllErrors(),
              form: error.error.message,
            },
          });
        }
      );
    },
  });

  return (
    <AuthForm.Root>
      <AuthForm.Header
        title={t('auth.welcome_back')}
        description={t('auth.login_form_desc')}
      />
      <AuthForm.Content>
        <GoogleAuth.LogIn />

        <div className="py-4">
          <Divider text={t('auth.or_continue')} backgroundClass="bg-card" />
        </div>

        <form onSubmit={emailForm.handleSubmit} className="flex flex-col gap-4">
          <FormInput
            id="email"
            label="Email"
            type="email"
            name="email"
            placeholder="name@example.com"
            required
          />

          <PasswordInput
            id="password"
            name="password"
            label={t('auth.password')}
            required
          />

          {emailForm.state.isSubmitted && (
            <AuthForm.Error
              error={(() => {
                const error = emailForm.state.errors;
                if (error instanceof ArkErrors) {
                  return error.summary;
                } else {
                  return String(error);
                }
              })()}
            />
          )}

          <Button
            autoFocus
            type="submit"
            className="w-full"
            disabled={emailForm.state.isSubmitting}
          >
            {emailForm.state.isSubmitting ? (
              <AuthForm.Spinner />
            ) : (
              t('auth.login')
            )}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground text-center mt-2">
          <AuthForm.Footer
            type="login"
            onBack={() => navigate({ to: '/signup' })}
          />
        </div>
      </AuthForm.Content>
    </AuthForm.Root>
  );
}
