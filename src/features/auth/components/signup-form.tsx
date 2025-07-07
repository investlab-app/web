import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ResultAsync, err, ok } from 'neverthrow';
import { ArkErrors, type } from 'arktype';
import { useAuthForm } from '../hooks/use-auth-form';
import { GoogleAuth } from '@/features/auth/components/social/google-auth';

export function SignUpForm() {
  const { isLoaded, signUp } = useSignUp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useAuthForm({
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
        formApi.setErrorMap({
          onSubmit: {
            ...formApi.getAllErrors(),
            form: 'Please try again later.',
          },
        });
        return;
      }

      const signUpResult = ResultAsync.fromPromise(
        signUp.create({
          emailAddress: value.email,
          password: value.password,
          firstName: value.firstName,
          lastName: value.lastName,
        }),
        (e) =>
          e instanceof Error
            ? e.message
            : 'Could not sign up. Please try again later.'
      ).andThen((signUpResource) => {
        switch (signUpResource.status) {
          case 'complete':
            return ok();
          case 'abandoned':
            return err(t('auth.abandoned'));
          case 'missing_requirements':
            return err(t('auth.missing_requirements'));
          case null:
            return err(t('auth.could_not_sign_up'));
        }
      });

      const prepareEmailAddressVerificationResult = ResultAsync.fromPromise(
        signUp.prepareEmailAddressVerification({ strategy: 'email_code' }),
        (e) =>
          e instanceof Error
            ? e.message
            : 'Could not prepare email address verification.'
      ).andThen((signUpResource) => {
        switch (signUpResource.status) {
          case 'complete':
            return ok();
          case 'abandoned':
            return err(t('auth.abandoned'));
          case 'missing_requirements':
            return err(t('auth.missing_requirements'));
          case null:
            return err(t('auth.could_not_prepare_email_address_verification'));
        }
      });

      await ResultAsync.combine([
        signUpResult,
        prepareEmailAddressVerificationResult,
      ]).match(
        () => {
          navigate({ to: '/verify-email' });
        },
        (e) => {
          formApi.setErrorMap({
            onSubmit: {
              ...formApi.getAllErrors(),
              form: e,
            },
          });
        }
      );
    },
  });

  return (
    <form>
      <form.AppForm>
        <form.Root>
          <form.Header
            title={t('auth.create_your_account')}
            description={t('auth.signup_form_desc')}
          />
          <form.Content>
            <GoogleAuth.SignUp />
            <form.Divider />
            <form.FormContent>
              <form.AppField
                name="firstName"
                children={(field) => (
                  <field.FormInput
                    id="firstName"
                    label={t('auth.first_name')}
                    name="firstName"
                    placeholder={t('auth.first_name_placeholder')}
                    autoComplete="given-name"
                    required
                  />
                )}
              />
              <form.AppField
                name="lastName"
                children={(field) => (
                  <field.FormInput
                    id="lastName"
                    label={t('auth.last_name')}
                    name="lastName"
                    placeholder={t('auth.last_name_placeholder')}
                    autoComplete="family-name"
                    required
                  />
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.FormInput
                    id="email"
                    label="Email"
                    type="email"
                    name="email"
                    placeholder={t('auth.email_placeholder')}
                    autoComplete="email"
                    required
                  />
                )}
              />
              <form.AppField
                name="password"
                children={(field) => (
                  <field.FormInput
                    id="password"
                    label={t('auth.password')}
                    type="password"
                    name="password"
                    placeholder={t('auth.password_placeholder')}
                    autoComplete="new-password"
                    required
                  />
                )}
              />
              <form.AppField
                name="confirmPassword"
                children={(field) => (
                  <field.FormInput
                    id="confirmPassword"
                    label={t('auth.confirm_password')}
                    type="password"
                    name="confirmPassword"
                    placeholder={t('auth.password_placeholder')}
                    autoComplete="new-password"
                    required
                  />
                )}
              />
              <form.Error />
              <form.ClerkCaptcha />
              <form.SubmitButton> {t('auth.signup')} </form.SubmitButton>
            </form.FormContent>
            <form.Footer
              text={t('auth.already_have_an_account')}
              oppositeType="login"
              actionText={t('auth.login')}
            />
          </form.Content>
        </form.Root>
      </form.AppForm>
    </form>
  );
}
