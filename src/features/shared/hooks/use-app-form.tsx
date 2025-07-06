import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { ArkErrors } from 'arktype';
import { AuthForm } from '../../login/components/auth-form';
import { SixDigitOTPInput as SixDigitOTPInputComponent } from '@/features/shared/components/ui/six-digit-otp-input';
import { Button } from '@/features/shared/components/ui/button';

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const SixDigitOTPInput = () => {
  const field = useFieldContext<string>();
  return (
    <SixDigitOTPInputComponent
      value={field.state.value}
      onChange={(value) => field.handleChange(value.toString())}
    />
  );
};

interface SubmitButtonProps {
  children: React.ReactNode;
}

const SubmitButton = ({ children }: SubmitButtonProps) => {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => state.canSubmit }
      children={(canSubmit) => (
        <Button type="submit" disabled={!canSubmit} >
          {children}
        </Button>
      )}
    />
  );
};

const Error = () => {
  const form = useFormContext();
  return (
    <>
      {form.state.isSubmitted && (
        <AuthForm.Error
          error={(() => {
            const error = form.state.errors;
            if (error instanceof ArkErrors) {
              return error.summary;
            } else {
              return String(error);
            }
          })()}
        />
      )}
    </>
  );
};

export const { useAppForm } = createFormHook({
  fieldComponents: {
    SixDigitOTPInput,
  },
  formComponents: {
    SubmitButton,
    Error,
  },
  fieldContext,
  formContext,
});
