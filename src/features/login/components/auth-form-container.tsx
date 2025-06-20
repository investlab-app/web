import type { ReactNode } from 'react';
import { cn } from '@/features/shared/utils';
import { Card, CardContent, CardHeader } from '@/features/shared/components/ui/card';

interface AuthFormContainerProps {
  className?: string;
  children: ReactNode;
  header?: ReactNode;
}

export function AuthFormContainer({
  className,
  children,
  header,
}: AuthFormContainerProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card>
        {header && <CardHeader>{header}</CardHeader>}
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
