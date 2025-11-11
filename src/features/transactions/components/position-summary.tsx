import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { SummaryMetric, SummaryMetricSkeleton } from './summary-metric';
import type { Position } from '@/client';
import { InstrumentIconCircle } from '@/features/instruments/components/instrument-image-circle';
import { Button } from '@/features/shared/components/ui/button';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { getProfitabilityColor } from '@/features/shared/utils/colors';
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
    <div className={cn('bg-muted/40', className)}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 sm:gap-4 py-3 border-b-muted-foreground/10 border-b px-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label={isCollapsed ? t('common.expand') : t('common.collapse')}
            aria-expanded={!isCollapsed}
            onClick={(event) => {
              event.stopPropagation();
              setCollapsed();
            }}
            className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 border border-transparent hover:border-muted-foreground/20"
          >
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform',
                isCollapsed ? '-rotate-90' : 'rotate-0'
              )}
            />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3">
            <InstrumentIconCircle
              icon={position.icon}
              symbol={position.symbol}
              name={position.name}
              size="sm"
            />
            {isNavigable ? (
              <Button
                variant="link"
                asChild
                className="px-0 text-foreground text-sm sm:text-base font-semibold truncate max-w-[120px] sm:max-w-none"
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
              <span className="text-sm sm:text-base font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">
                {position.name}
              </span>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
          <SummaryMetric
            label={t('common.quantity')}
            value={toFixedLocalized(
              Number(position.quantity),
              i18n.language,
              2
            )}
            containerClassName="min-w-0 border-b border-r md:border-b-0 pl-4"
          />
          <SummaryMetric
            label={t('common.market_value')}
            value={`${toFixedLocalized(Number(position.market_value), i18n.language, 2)}`}
            containerClassName="min-w-0 border-b md:border-b-0 md:border-r"
          />
          <SummaryMetric
            label={t('common.gain')}
            value={toFixedLocalized(position.gain, i18n.language, 2)}
            valueClassName={getProfitabilityColor(position.gain)}
            containerClassName="min-w-0 border-r"
          />
          <SummaryMetric
            label={t('common.gain_percentage')}
            value={
              position.gain_percentage === null
                ? 'N/A'
                : `${toFixedLocalized(position.gain_percentage, i18n.language, 2)}%`
            }
            valueClassName={getProfitabilityColor(position.gain_percentage)}
            containerClassName="min-w-0"
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
        'px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 bg-muted/40 border-b border-muted-foreground/10',
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 border border-transparent"
          >
            <ChevronDown
              className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform')}
            />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
            <Skeleton className="h-5 w-24 sm:h-6 sm:w-32" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-2 md:gap-x-4">
          <SummaryMetricSkeleton />
          <SummaryMetricSkeleton />
          <SummaryMetricSkeleton />
          <SummaryMetricSkeleton />
        </div>
      </div>
    </div>
  );
}
