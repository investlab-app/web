import { useSignUp } from '@clerk/clerk-react';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { ArkErrors, type } from 'arktype';
import { ResultAsync } from 'neverthrow';
import type { AnyFieldApi } from '@tanstack/react-form';
import type { ClerkError } from '@/features/login/clerk-error';
import { SixDigitOTPInput } from '@/features/shared/components/ui/six-digit-otp-input';
import { Button } from '@/features/shared/components/ui/button';
import { AuthForm } from '@/features/login/components/auth-form';

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm: useAuthForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext,
  formContext,
});

export function EmailVerificationForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
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
        return formApi.setErrorMap({
          onSubmit: {
            ...formApi.getAllErrors(),
            form: 'Please try again later.',
          },
        });
      }

      const result = await ResultAsync.fromPromise(
        signUp.attemptEmailAddressVerification({
          code: value.code,
        }),
        (err): ClerkError => ({
          type: 'clerk',
          error:
            err instanceof Error ? err : new Error('Could not verify email.'),
        })
      );

      result.match(
        (resource) => {
          if (resource.status === 'complete') {
            setActive({ session: resource.createdSessionId });
            navigate({ to: '/' });
          } else {
            return formApi.setErrorMap({
              onSubmit: {
                ...formApi.getAllErrors(),
                form: 'Could not verify email.',
              },
            });
          }
        },
        (err) =>
          formApi.setErrorMap({
            onSubmit: {
              ...formApi.getAllErrors(),
              form: err.error.message,
            },
          })
      );
    },
  });

  return (
    <AuthForm.Root>
      <AuthForm.Header
        title="Verify your email"
        description="Enter the code sent to your email"
      />
      <AuthForm.Content>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="grid gap-6"
        >
          <div className="flex justify-center">
            <form.Field
              name="code"
              children={({ state, handleChange }: AnyFieldApi) => (
                <>
                  <SixDigitOTPInput
                    value={state.value}
                    onChange={(value) => handleChange(value.toString())}
                  />
                </>
              )}
            />
          </div>

          {form.state.isSubmitted && (
            <p className="text-red-600 text-sm">
              {(() => {
                const error = form.state.errors;
                if (error instanceof ArkErrors) {
                  return error.summary;
                } else {
                  return String(error);
                }
              })()}
            </p>
          )}

          <form.Subscribe
            selector={(state) => {
              console.log('state: ', state);
              return state.isDirty && state.canSubmit;
            }}
            children={(canSubmit) => (
              <Button type="submit" disabled={!canSubmit} className="w-full">
                Verify Email
              </Button>
            )}
          />

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
    </AuthForm.Root>
  );
}
