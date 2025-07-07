import { useFieldContext } from '.';
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

  return (
    <FormInputComponent
      id={id}
      label={label}
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      onChange={(e) => field.handleChange(e.target.value)}
      {...props}
    />
  );
};
