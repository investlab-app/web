import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/styles';

type FormInputProps = {
  id: string;
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
} & React.ComponentProps<'input'>;

export function FormInput({
  id,
  label,
  type = 'text',
  name,
  placeholder,
  required = false,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </div>
  );
}
