import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ResultAsync, err, ok } from 'neverthrow';
import { ArkErrors, match, type } from 'arktype';
import { useAuthForm } from '../hooks/use-auth-form';
import { ContinueWithGoogle } from '@/features/auth/components/social/google-auth';

interface LoginFormProps {
  error?: string;
}

export function LoginForm({ error }: LoginFormProps) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useAuthForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value, formApi }) => {
      console.log('running onSubmit with values:', value);
      if (!isLoaded) {
        formApi.setErrorMap({
          onSubmit: {
            ...formApi.getAllErrors(),
            form: 'Please try again later.',
          },
        });
        return;
      }

      await ResultAsync.fromPromise(
        signIn.create({
          strategy: 'password',
          identifier: value.email,
          password: value.password,
        }),
        (e) => (e instanceof Error ? e.message : 'Could not verify email.')
      )
        .andThen((signInResource) =>
          match({
            "'complete'": () =>
              signInResource.createdSessionId
                ? ok(signInResource.createdSessionId)
                : err('No session created'),
            "'needs_first_factor'": () => err(t('auth.needs_first_factor')),
            "'needs_second_factor'": () => err(t('auth.needs_second_factor')),
            "'needs_identifier'": () => err(t('auth.needs_identifier')),
            "'needs_new_password'": () => err(t('auth.needs_new_password')),
            null: () => err(t('auth.could_not_sign_in')),
            default: 'never',
          })(signInResource.status)
        )
        .match(
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
    <form.AppForm>
      <form.Root>
        <form.Header
          title={t('auth.welcome_back')}
          description={t('auth.login_form_desc')}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form.Content>
          <ContinueWithGoogle />
          <form.Divider />
          <form>
            <form.FormContent>
              <form.AppField
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const validator = type('string.email');
                    const validated = validator(value);
                    return validated instanceof ArkErrors ? validated : null;
                  },
                }}
                children={(field) => (
                  <>
                    <field.FormInput
                      id="email"
                      label="Email"
                      type="email"
                      name="email"
                      placeholder={t('auth.email_placeholder')}
                      autoComplete="email"
                      required
                    />
                  </>
                )}
              />
              <form.AppField
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    const validator = type(
                      'string > 7 & /[A-Z]/ & /[a-z]/ & /[0-9]/ & /[^A-Za-z0-9]/'
                    );
                    const validated = validator(value);
                    return validated instanceof ArkErrors ? validated : null;
                  },
                }}
                children={(field) => {
                  console.log(
                    'field.state.meta.errorMap',
                    field.state.meta.errorMap
                  );
                  return (
                    <>
                      <field.FormInput
                        id="password"
                        label={t('auth.password')}
                        type="password"
                        name="password"
                        placeholder="********"
                        autoComplete="current-password"
                        required
                      />
                    </>
                  );
                }}
              />
              <form.Error />
              <form.SubmitButton>{t('auth.login')}</form.SubmitButton>
            </form.FormContent>
          </form>
          <form.Footer
            text={t('auth.dont_have_an_account')}
            oppositeType="signup"
            actionText={t('auth.signup')}
          />
        </form.Content>
      </form.Root>
    </form.AppForm>
  );
}
