import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { cn } from '@/features/shared/utils/styles';

interface SummaryMetricProps {
  label: string;
  value: string;
  valueClassName?: string;
  containerClassName?: string;
}

export function SummaryMetric({
  label,
  value,
  valueClassName,
  containerClassName,
}: SummaryMetricProps) {
  return (
    <div
      className={cn(
        'border-muted-foreground/10 p-3',
        containerClassName
      )}
    >
      <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground/80">
        {label}
      </p>
      <p className={cn('mt-1 text-base font-semibold', valueClassName)}>
        {value}
      </p>
    </div>
  );
}

export function SummaryMetricSkeleton() {
  return (
    <div className="border-muted-foreground/10 p-3 min-w-[140px]">
      <Skeleton className="h-3 w-20 mb-1" />
      <Skeleton className="h-6 w-24" />
    </div>
  );
}
