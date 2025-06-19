import { CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/features/shared/utils';

interface AuthFormHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function AuthFormHeader({
  title,
  description,
  className,
}: AuthFormHeaderProps) {
  return (
    <div className={cn('text-center', className)}>
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </div>
  );
}
