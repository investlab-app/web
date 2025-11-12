import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

import { LoadingSpinner } from '@/features/shared/components/ui/loading-spinner';
import { Button } from '@/features/shared/components/ui/button';
import { FormInput as FormInputComponent } from '@/features/shared/components/ui/form-input';
import { SixDigitOTPInput as SixDigitOTPInputComponent } from '@/features/shared/components/ui/six-digit-otp-input';
import { NumberInput as NumberInputComponent } from '@/features/shared/components/ui/number-input';

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const SixDigitOTPInput = () => {
  const field = useFieldContext<string>();
  return (
    <SixDigitOTPInputComponent
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(value) => field.handleChange(value.toString())}
    />
  );
};

const NumberInput = (
  props: Omit<
    React.ComponentProps<typeof NumberInputComponent>,
    'value' | 'onBlur' | 'onValueChange'
  >
) => {
  const field = useFieldContext<number>();
  return (
    <NumberInputComponent
      value={field.state.value}
      onBlur={field.handleBlur}
      onValueChange={(value) => {
        if (value !== undefined) {
          field.handleChange(value);
        }
      }}
      {...props}
    />
  );
};

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
}

const SubmitButton = ({ children, className }: SubmitButtonProps) => {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => state.isSubmitting}
      children={(isSubmitting) => (
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => {
            form.handleSubmit();
          }}
          className={className}
        >
          {form.state.isSubmitting ? <LoadingSpinner /> : children}
        </Button>
      )}
    />
  );
};

type FormInputProps = {
  id: string;
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
} & React.ComponentProps<'input'>;

const FormInput = ({
  id,
  label,
  type,
  name,
  placeholder,
  required,
  ...props
}: FormInputProps) => {
  const field = useFieldContext<string>();

  return (
    <FormInputComponent
      id={id}
      label={label}
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      onChange={(e) => {
        field.handleChange(e.target.value);
      }}
      onBlur={field.handleBlur}
      {...props}
    />
  );
};

export const { useAppForm } = createFormHook({
  fieldComponents: {
    FormInput,
    SixDigitOTPInput,
    NumberInput,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
