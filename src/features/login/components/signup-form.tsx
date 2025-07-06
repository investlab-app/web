import { useSignUp } from '@clerk/clerk-react';
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

export function SignUpForm() {
  const { isLoaded, signUp } = useSignUp();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const emailForm = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    validators: {
      onChange: ({ value }) => {
        const validator = type({
          email: 'string',
          password: 'string > 7 & /[A-Z]/ & /[a-z]/ & /[0-9]/ & /[^A-Za-z0-9]/',
          confirmPassword: 'string',
          firstName: 'string',
          lastName: 'string',
        });

        const validated = validator(value);

        if (validated instanceof ArkErrors) {
          return validated;
        }

        if (validated.confirmPassword !== validated.password) {
          return 'Passwords do not match';
        }
      },
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

      const signUpResult = ResultAsync.fromPromise(
        signUp.create({
          emailAddress: value.email,
          password: value.password,
          firstName: value.firstName,
          lastName: value.lastName,
        }),
        (err): ClerkError => ({
          type: 'clerk',
          error: err instanceof Error ? err : new Error('Could not sign up.'),
        })
      );

      const prepareEmailAddressVerificationResult = ResultAsync.fromPromise(
        signUp.prepareEmailAddressVerification({ strategy: 'email_code' }),
        (err): ClerkError => ({
          type: 'clerk',
          error:
            err instanceof Error
              ? err
              : new Error('Could not prepare email address verification.'),
        })
      );

      const result = await ResultAsync.combine([
        signUpResult,
        prepareEmailAddressVerificationResult,
      ]);

      result.match(
        () => {
          navigate({ to: '/verify-email' });
        },
        (error) =>
          formApi.setErrorMap({
            onSubmit: {
              ...formApi.getAllErrors(),
              form: error.error.message,
            },
          })
      );
    },
  });

  return (
    <AuthForm.Root>
      <AuthForm.Header
        title={t('auth.create_your_account')}
        description={t('auth.signup_form_desc')}
      />
      <AuthForm.Content>
        <GoogleAuth.SignUp />

        <div className="py-4">
          <Divider text={t('auth.or_continue')} backgroundClass="bg-card" />
        </div>

        <form onSubmit={emailForm.handleSubmit} className="flex flex-col gap-4">
          <FormInput
            id="firstName"
            label={t('auth.first_name')}
            name="firstName"
            required
          />

          <FormInput
            id="lastName"
            label={t('auth.last_name')}
            name="lastName"
            required
          />

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

          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label={t('auth.confirm_password')}
            required
          />

          <div id="clerk-captcha" className="flex justify-center" />

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
              t('auth.signup')
            )}
          </Button>
        </form>

        <AuthForm.Footer
          type="signup"
          onBack={() => navigate({ to: '/login' })}
        />
      </AuthForm.Content>
    </AuthForm.Root>
  );
}
