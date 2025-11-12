import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { cn } from '../utils/styles';
import { Button } from './ui/button';
import type { LinkProps } from '@tanstack/react-router';

export const EmptyMessage = ({
  message,
  className,
  cta,
}: {
  message: string;
  className?: string;
  cta?: LinkProps & { label: string };
}) => {
  return (
    <div
      className={cn(
        'h-full flex flex-col items-center justify-center text-center text-muted-foreground min-h-[180px]',
        className
      )}
    >
      <p>{message}</p>
      {cta && (
        <Button variant="link" asChild>
          <Link {...cta}>
            <ArrowRight />
            {cta.label}
          </Link>
        </Button>
      )}
    </div>
  );
};
