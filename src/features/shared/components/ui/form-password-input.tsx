import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/styles';
import { Input } from './input';
import { Button } from './button';
import { Label } from './label';

const FormPasswordInput = ({
  id,
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 hover:bg-transparent"
          onClick={handleTogglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="size-4 text-muted-foreground" />
          ) : (
            <Eye className="size-4 text-muted-foreground" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export { FormPasswordInput };
