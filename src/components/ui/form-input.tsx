import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function FormInput({
  id,
  label,
  type = 'text',
  name,
  placeholder,
  required = false,
  className,
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
      />
    </div>
  );
}
