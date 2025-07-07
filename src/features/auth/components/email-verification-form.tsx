import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { type } from 'arktype';
import { ResultAsync, err, ok } from 'neverthrow';
import { useTranslation } from 'react-i18next';
import { useAuthForm } from '@/features/auth/hooks/use-auth-form';

export function EmailVerificationForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useAuthForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onChange: type({ code: 'string == 6' }),
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
        signUp.attemptEmailAddressVerification({
          code: value.code,
        }),
        (e) => (e instanceof Error ? e.message : 'Could not verify email.')
      ).andThen((signUpResource) => {
        switch (signUpResource.status) {
          case 'complete':
            return signUpResource.createdSessionId
              ? ok(signUpResource.createdSessionId)
              : err('No session created');
          case 'abandoned':
            return err(t('auth.abandoned'));
          case 'missing_requirements':
            return err(t('auth.missing_requirements'));
          case null:
            return err(t('auth.could_not_verify_email'));
        }
      });

      sessionIdResult.match(
        (sessionId) => {
          setActive({ session: sessionId });
          navigate({ to: '/' });
        },
        (e) =>
          formApi.setErrorMap({
            onSubmit: {
              ...formApi.getAllErrors(),
              form: e,
            },
          })
      );
    },
  });

  return (
    <form.AppForm>
      <form.Root>
        <form.Header
          title="Verify your email"
          description="Enter the code sent to your email"
        />
        <form.Content>
          <form.AppField
            name="code"
            children={(field) => <field.SixDigitOTPInput />}
          />
          <form.Error />
          <form.SubmitButton>Verify Email</form.SubmitButton>
          <form.BackButton />
        </form.Content>
      </form.Root>
    </form.AppForm>
  );
}
