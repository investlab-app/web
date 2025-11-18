import { useTranslation } from 'react-i18next';
import type { Position } from '@/client';
import { cn } from '@/features/shared/utils/styles';
import { withCurrency } from '@/features/shared/utils/numbers';
import { Card, CardContent } from '@/features/shared/components/ui/card';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

interface InstrumentSummaryProps {
  position: Position;
  className?: string;
}

interface SummaryItemProps {
  label: string;
  value: string;
  isGain?: boolean;
  isNegative?: boolean;
}

function SummaryItem({
  label,
  value,
  isGain = false,
  isNegative = false,
}: SummaryItemProps) {
  return (
    <div className="flex flex-col gap-0.5 py-0">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </span>
      <span
        className={cn(
          'text-sm font-bold truncate',
          isGain && isNegative
            ? 'text-[var(--red)]'
            : isGain
              ? 'text-[var(--green)]'
              : 'text-foreground'
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function InstrumentSummary({
  position,
  className,
}: InstrumentSummaryProps) {
  const { t, i18n } = useTranslation();

  return (
    <Card className={cn('shadow-sm bg-muted/30 py-0', className)}>
      <CardContent className="p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 sm:gap-8 divide-x">
          <SummaryItem
            label={t('transactions.summary.owned_assets')}
            value={position.quantity}
          />
          <SummaryItem
            label={t('transactions.summary.assets_value')}
            value={withCurrency(position.market_value, i18n.language, 2)}
          />
          <SummaryItem
            label={t('investor.gain')}
            value={withCurrency(position.gain, i18n.language, 2)}
            isGain={true}
            isNegative={position.gain < 0}
          />
          <SummaryItem
            label={t('investor.gain_percent')}
            value={
              position.gain_percentage !== null
                ? `${withCurrency(position.gain_percentage, i18n.language, 2)}%`
                : 'N/A'
            }
            isGain={true}
            isNegative={
              position.gain_percentage !== null && position.gain_percentage < 0
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function InstrumentSummarySkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={cn('shadow-sm bg-muted/30', className)}>
      <CardContent className="p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 sm:gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
