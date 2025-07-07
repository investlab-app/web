import { useState } from 'react';
import { useFieldContext } from '.';
import type { ArkError } from 'arktype';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/features/shared/components/ui/alert';
import { FormInput as FormInputComponent } from '@/features/shared/components/ui/form-input';

type FormInputProps = {
  id: string;
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
} & React.ComponentProps<'input'>;

export const FormInput = ({
  id,
  label,
  type,
  name,
  placeholder,
  required,
  ...props
}: FormInputProps) => {
  const field = useFieldContext<string>();

  const [wasBlurred, setWasBlurred] = useState(false);

  if (field.state.meta.isBlurred && !wasBlurred) {
    setWasBlurred(true);
  }

  const errors =
    field.state.meta.errorMap.onChange ||
    field.state.meta.errorMap.onBlur ||
    [];

  return (
    <>
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
      {errors.length > 0 && wasBlurred && (
        <Alert variant="destructive">
          <AlertTitle>
            {label.charAt(0).toUpperCase() + label.slice(1)} requirements:
          </AlertTitle>
          <AlertDescription>
            <ul className="list-inside list-disc text-sm">
              {errors
                .flatMap((error: ArkError) =>
                  error.hasCode('intersection') ? error.errors : [error]
                )
                .map((error: ArkError) => (
                  <li key={`${error.path.join()}-${error.expected}`}>
                    {error.expected}
                  </li>
                ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
