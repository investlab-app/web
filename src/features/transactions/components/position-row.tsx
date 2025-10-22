import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
import { Badge } from '@/features/shared/components/ui/badge';
import { InstrumentIconCircle } from '@/features/instruments/components/instrument-image-circle';

interface PositionRowProps {
  position: Position;
  isNavigable?: boolean;
}

export const PositionRow = ({
  position,
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
    <>
      <div
        className="rounded-xl border border-border bg-card/40 p-4 transition-colors hover:bg-muted/40"
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <Button
                variant="outline"
                size="icon"
                aria-label={
                  collapsed ? t('common.expand') : t('common.collapse')
                }
                aria-expanded={!collapsed}
                onClick={(event) => {
                  event.stopPropagation();
                  handleToggle();
                }}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <div className='space-y-2'>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <InstrumentIconCircle
                    icon={position.logo}
                    symbol={position.symbol}
                    name={position.name}
                    size="md"
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="link"
                      asChild
                      className="p-0 text-lg font-semibold hover:no-underline"
                    >
                      {isNavigable ? (
                        <Link
                          aria-label={`${t('transactions.actions.instrument_details')} ${position.name}`}
                          title={t('transactions.actions.instrument_details')}
                          to={`/instruments/${position.symbol}`}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {position.name}
                        </Link>
                      ) : (
                        <span className="text-lg font-semibold">
                          {position.name}
                        </span>
                      )}
                    </Button>
                    <Badge variant="secondary">{position.symbol}</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {summaryItems.map((item, index) => (
                    <span
                      className="flex items-center gap-3"
                      key={`${item}-${index}`}
                    >
                      {index !== 0 && (
                        <span aria-hidden className="text-muted-foreground/60">
                          •
                        </span>
                      )}
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-4">
              <SummaryMetric
                label={t('common.quantity')}
                value={toFixedLocalized(position.quantity, i18n.language, 2)}
              />
              <SummaryMetric
                label={t('common.market_value')}
                value={`${toFixedLocalized(position.market_value, i18n.language, 2)} ${t('common.currency')}`}
              />
              <SummaryMetric
                label={t('common.gain')}
                value={`${toFixedLocalized(position.gain, i18n.language, 2)} ${t('common.currency')}`}
                valueClassName={getProfabilityColor(position.gain)}
              />
              <SummaryMetric
                label={t('common.gain_percentage')}
                value={
                  position.gain_percentage === null
                    ? 'N/A'
                    : `${toFixedLocalized(position.gain_percentage, i18n.language, 2)}%`
                }
                valueClassName={getProfabilityColor(position.gain_percentage)}
              />
            </div>
          </div>
        </div>
      </div>

      {!collapsed && (
        <Table>
          <PositionsTableHeader />
          <TableBody>
            {position.history.map((h, i) => (
              <TransactionRow key={i} entry={h} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

interface SummaryMetricProps {
  label: string;
  value: string;
  valueClassName?: string;
}

const SummaryMetric = ({
  label,
  value,
  valueClassName,
}: SummaryMetricProps) => (
  <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
    <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
      {label}
    </p>
    <p className={cn('mt-1 text-sm font-semibold', valueClassName)}>{value}</p>
  </div>
);
