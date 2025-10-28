import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { getProfabilityColor } from '../../shared/utils/colors';
import { TransactionRow } from './transaction-row';
import { PositionsTableHeader } from './positions-table';
import type { Position } from '@/client/types.gen';
import { Table, TableBody } from '@/features/shared/components/ui/table';
import { toFixedLocalized } from '@/features/shared/utils/numbers';
import { Button } from '@/features/shared/components/ui/button';
import { dateToLocale } from '@/features/shared/utils/date';
import { cn } from '@/features/shared/utils/styles';
import { InstrumentIconCircle } from '@/features/instruments/components/instrument-image-circle';

interface PositionRowProps {
  position: Position;
  className?: string;
  isNavigable?: boolean;
}

export const PositionRow = ({
  position,
  className,
  isNavigable = true,
}: PositionRowProps) => {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

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
    <div className={className}>
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-[#343434] border border-[#525252]">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="ghost"
            size="icon"
            aria-label={collapsed ? t('common.expand') : t('common.collapse')}
            aria-expanded={!collapsed}
            onClick={(event) => {
              event.stopPropagation();
              handleToggle();
            }}
            className="h-full w-9 border-r border-[#525252]"
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                collapsed ? '-rotate-90' : 'rotate-0'
              )}
            />
          </Button>
          <div className="flex flex-row items-center gap-4">
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
                className="px-0 text-foreground text-lg"
              >
                <Link
                  aria-label={`${t('transactions.actions.instrument_details')} ${position.name}`}
                  title={t('transactions.actions.instrument_details')}
                  to={`/instruments/${position.symbol}`}
                  className="break-words"
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
        <div className="grid w-full sm:grid-cols-2 lg:w-auto lg:grid-cols-4 items-center">
          <SummaryMetric
            label={t('common.quantity')}
            value={toFixedLocalized(position.quantity, i18n.language, 2)}
            containerClassName="min-w-[160px]"
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
            containerClassName="min-w-[160px]"
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

      {!collapsed && (
        <Table className="border border-muted">
          <PositionsTableHeader className="" />
          <TableBody>
            {position.history.map((h, i) => (
              <TransactionRow key={i} entry={h} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

interface SummaryMetricProps {
  label: string;
  value: string;
  valueClassName?: string;
  containerClassName?: string;
}

const SummaryMetric = ({
  label,
  value,
  valueClassName,
  containerClassName,
}: SummaryMetricProps) => (
  <div className={cn('border-[#525252] border-l p-3', containerClassName)}>
    <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground/80">
      {label}
    </p>
    <p className={cn('mt-1 text-base font-semibold', valueClassName)}>
      {value}
    </p>
  </div>
);
