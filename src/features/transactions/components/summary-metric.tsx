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
        'border-muted-foreground/10 border-l p-3',
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
