import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ResultAsync, err, ok } from 'neverthrow';
import { type } from 'arktype';
import { useAuthForm } from '../hooks/use-auth-form';
import { GoogleAuth } from '@/features/auth/components/social/google-auth';

export function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useAuthForm({
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
        formApi.setErrorMap({
          onSubmit: {
            ...formApi.getAllErrors(),
            form: 'Please try again later.',
          },
        });
        return;
      }

      const sessionIdResult = await ResultAsync.fromPromise(
        signIn.create({
          strategy: 'password',
          identifier: value.email,
          password: value.password,
        }),
        (e) => (e instanceof Error ? e.message : 'Could not verify email.')
      ).andThen((signInResource) => {
        switch (signInResource.status) {
          case 'complete':
            return signInResource.createdSessionId
              ? ok(signInResource.createdSessionId)
              : err('No session created');
          case 'needs_first_factor':
            return err(t('auth.needs_first_factor'));
          case 'needs_second_factor':
            return err(t('auth.needs_second_factor'));
          case 'needs_identifier':
            return err(t('auth.needs_identifier'));
          case 'needs_new_password':
            return err(t('auth.needs_new_password'));
          case null:
            return err(t('auth.could_not_sign_in'));
        }
      });

      sessionIdResult.match(
        (sessionId) => {
          setActive({ session: sessionId });
          navigate({ to: '/' });
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
            title={t('auth.welcome_back')}
            description={t('auth.login_form_desc')}
          />
          <form.Content>
            <GoogleAuth.LogIn />
            <form.Divider />
            <form.FormContent>
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
                    placeholder="********"
                    autoComplete="current-password"
                    required
                  />
                )}
              />
              <form.Error />
              <form.SubmitButton>{t('auth.login')}</form.SubmitButton>
            </form.FormContent>
            <form.Footer
              text={t('auth.dont_have_an_account')}
              oppositeType="signup"
              actionText={t('auth.signup')}
            />
          </form.Content>
        </form.Root>
      </form.AppForm>
    </form>
  );
}
