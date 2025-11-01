import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { SummaryMetric, SummaryMetricSkeleton } from './summary-metric';
import type { Position } from '@/client';
import { InstrumentIconCircle } from '@/features/instruments/components/instrument-image-circle';
import { Button } from '@/features/shared/components/ui/button';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { getProfabilityColor } from '@/features/shared/utils/colors';
import { dateToLocale } from '@/features/shared/utils/date';
import { toFixedLocalized } from '@/features/shared/utils/numbers';
import { cn } from '@/features/shared/utils/styles';

export function PositionSummary({
  position,
  setCollapsed,
  isCollapsed,
  className,
  isNavigable = true,
}: {
  position: Position;
  setCollapsed: () => void;
  isCollapsed: boolean;
  isNavigable?: boolean;
  className?: string;
}) {
  const { t, i18n } = useTranslation();

  const latestTransaction = position.history.at(0);
  const summaryItems = [
    t('transactions.position.summary.transactions_count', {
      count: position.history.length,
    }),
  ];

  summaryItems.push(
    latestTransaction
      ? t('transactions.position.summary.last_transaction', {
          action: t(
            latestTransaction.is_buy
              ? 'transactions.badge.buy'
              : 'transactions.badge.sell'
          ),
          date: dateToLocale(latestTransaction.timestamp, i18n.language),
        })
      : t('transactions.position.summary.no_transactions')
  );

  return (
    <div className={cn('bg-muted/40 px-3 py-3 sm:px-4 sm:py-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Toggle + instrument */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label={isCollapsed ? t('common.expand') : t('common.collapse')}
            aria-expanded={!isCollapsed}
            onClick={(event) => {
              event.stopPropagation();
              setCollapsed();
            }}
            className="h-9 w-9 shrink-0 border border-transparent hover:border-muted-foreground/20"
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isCollapsed ? '-rotate-90' : 'rotate-0'
              )}
            />
          </Button>

          <div className="flex items-center gap-3 sm:gap-4">
            <InstrumentIconCircle
              icon={position.icon}
              symbol={position.symbol}
              name={position.name}
              size="md"
            />
            {isNavigable ? (
              <Button
                variant="link"
                asChild
                className="px-0 text-foreground text-lg font-semibold"
              >
                <Link
                  aria-label={`${t('transactions.actions.instrument_details')} ${position.name}`}
                  title={t('transactions.actions.instrument_details')}
                  to={`/instruments/${position.symbol}`}
                >
                  {position.name}
                </Link>
              </Button>
            ) : (
              <span className="text-lg font-semibold text-foreground">
                {position.name}
              </span>
            )}
          </div>
        </div>

        {/* Right: metrics */}
        <div className="grid w-full sm:w-auto grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-1 sm:gap-x-4">
          <SummaryMetric
            label={t('common.quantity')}
            value={toFixedLocalized(position.quantity, i18n.language, 2)}
            containerClassName="min-w-[140px]"
          />
          <SummaryMetric
            label={t('common.market_value')}
            value={`${toFixedLocalized(position.market_value, i18n.language, 2)}`}
            containerClassName="min-w-[160px]"
          />
          <SummaryMetric
            label={t('common.gain')}
            value={toFixedLocalized(position.gain, i18n.language, 2)}
            valueClassName={getProfabilityColor(position.gain)}
            containerClassName="min-w-[140px]"
          />
          <SummaryMetric
            label={t('common.gain_percentage')}
            value={
              position.gain_percentage === null
                ? 'N/A'
                : `${toFixedLocalized(position.gain_percentage, i18n.language, 2)}%`
            }
            valueClassName={getProfabilityColor(position.gain_percentage)}
            containerClassName="min-w-[140px]"
          />
        </div>
      </div>
    </div>
  );
}

export function PositionSummarySkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'px-3 py-3 sm:px-4 sm:py-4 bg-muted/40 border-b border-muted-foreground/10',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 border border-transparent"
          >
            <ChevronDown className={cn('h-4 w-4 transition-transform')} />
          </Button>
          <div className="flex items-center gap-3 sm:gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        <div className="grid w-full sm:w-auto grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-1 sm:gap-x-4">
          <SummaryMetricSkeleton />
          <SummaryMetricSkeleton />
          <SummaryMetricSkeleton />
          <SummaryMetricSkeleton />
        </div>
      </div>
    </div>
  );
}
