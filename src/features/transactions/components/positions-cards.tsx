import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import type { HistoryEntry } from '@/client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/features/shared/components/ui/tooltip';
import { dateToLocale } from '@/features/shared/utils/date';
import { Badge } from '@/features/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';

interface PositionsCardsProps {
  history: Array<HistoryEntry>;
  currentPrice?: number;
  className?: string;
}

function usePositionsCardHelpers(history: Array<HistoryEntry>) {
  const calculateAverageBuyPrice = (upToIndex: number): number | null => {
    let totalCost = 0;
    let totalQuantity = 0;

    for (let i = 0; i < upToIndex; i++) {
      const entry = history[i];
      if (entry.is_buy) {
        totalCost += entry.share_price * entry.quantity;
        totalQuantity += entry.quantity;
      } else {
        totalQuantity -= entry.quantity;
      }
    }

    if (totalQuantity <= 0) return null;
    return totalCost / totalQuantity;
  };

  const calculateNumericalGain = (
    entry: HistoryEntry,
    entryIndex: number,
    currentPrice?: number
  ): number | null => {
    if (entry.is_buy) {
      if (!currentPrice) return null;
      return (currentPrice - entry.share_price) * entry.quantity;
    } else {
      const avgBuyPrice = calculateAverageBuyPrice(entryIndex);
      if (avgBuyPrice === null) return null;
      return (entry.share_price - avgBuyPrice) * entry.quantity;
    }
  };

  const calculatePercentageGain = (
    entry: HistoryEntry,
    numericalGain: number | null | undefined,
    entryIndex?: number
  ): number | null => {
    if (numericalGain === undefined || numericalGain === null) return null;

    let totalAcquisitionCost = 0;
    if (entry.is_buy) {
      totalAcquisitionCost = entry.share_price * entry.quantity;
    } else {
      if (entryIndex === undefined) return null;
      const avgBuyPrice = calculateAverageBuyPrice(entryIndex);
      if (avgBuyPrice === null) return null;
      totalAcquisitionCost = avgBuyPrice * entry.quantity;
    }

    if (totalAcquisitionCost === 0) return null;
    return (numericalGain / totalAcquisitionCost) * 100;
  };

  const formatCurrency = (value: number, language: string): string => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getGainColor = (value: number): string => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  return {
    calculateNumericalGain,
    calculatePercentageGain,
    formatCurrency,
    formatPercentage,
    getGainColor,
    calculateAverageBuyPrice,
  };
}

function BuyCard({
  entry,
  entryIndex,
  currentPrice,
  helpers,
  language,
  t,
}: {
  entry: HistoryEntry;
  entryIndex: number;
  currentPrice?: number;
  helpers: ReturnType<typeof usePositionsCardHelpers>;
  language: string;
  t: (key: string) => string;
}) {
  const gain = helpers.calculateNumericalGain(entry, entryIndex, currentPrice);
  const gainPct = helpers.calculatePercentageGain(entry, gain, entryIndex);

  return (
    <Card
      className={[
        'flex-shrink-0 snap-start transition-colors',
        'w-[18rem] sm:w-80 md:w-96',
        'hover:bg-accent/40',
      ].join(' ')}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="default" className="mb-2">
              {t('transactions.badge.buy')}
            </Badge>
            <CardTitle className="text-sm text-muted-foreground">
              {dateToLocale(entry.timestamp, language)}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t('transactions.table.headers.quantity')}
            </span>
            <span className="font-semibold">{entry.quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t('transactions.table.headers.share_price')}
            </span>
            <span className="font-semibold">
              {helpers.formatCurrency(entry.share_price, language)}
            </span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                {t('transactions.table.headers.gain_loss')}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{t('transactions.tooltips.gain_loss')}</p>
                  </TooltipContent>
                </Tooltip>
              </span>
              {gain !== null ? (
                <span className={`font-semibold ${helpers.getGainColor(gain)}`}>
                  {helpers.formatCurrency(gain, language)}
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                {t('transactions.table.headers.gain_loss_pct')}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{t('transactions.tooltips.gain_loss_pct')}</p>
                  </TooltipContent>
                </Tooltip>
              </span>
              {gainPct !== null ? (
                <span
                  className={`font-semibold ${helpers.getGainColor(gainPct)}`}
                >
                  {helpers.formatPercentage(gainPct)}
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SellCard({
  entry,
  entryIndex,
  helpers,
  language,
  t,
}: {
  entry: HistoryEntry;
  entryIndex: number;
  helpers: ReturnType<typeof usePositionsCardHelpers>;
  language: string;
  t: (key: string) => string;
}) {
  const avgBuyPrice = helpers.calculateAverageBuyPrice(entryIndex);
  const gain = helpers.calculateNumericalGain(entry, entryIndex);
  const gainPct = helpers.calculatePercentageGain(entry, gain, entryIndex);

  return (
    <Card
      className={[
        'flex-shrink-0 snap-start transition-colors',
        'w-[18rem] sm:w-80 md:w-96',
        'hover:bg-accent/40',
      ].join(' ')}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">
              {t('transactions.badge.sell')}
            </Badge>
            <CardTitle className="text-sm text-muted-foreground">
              {dateToLocale(entry.timestamp, language)}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t('transactions.table.headers.quantity')}
            </span>
            <span className="font-semibold">{entry.quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t('transactions.cards.sold_at')}{' '}
              {t('transactions.table.headers.share_price')}
            </span>
            <span className="font-semibold">
              {helpers.formatCurrency(entry.share_price, language)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t('transactions.cards.avg_buy_price')}
            </span>
            <span className="font-semibold">
              {avgBuyPrice !== null
                ? helpers.formatCurrency(avgBuyPrice, language)
                : '—'}
            </span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                {t('transactions.cards.realized_gain_loss')}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{t('transactions.tooltips.gain_loss')}</p>
                  </TooltipContent>
                </Tooltip>
              </span>
              {gain !== null ? (
                <span className={`font-semibold ${helpers.getGainColor(gain)}`}>
                  {helpers.formatCurrency(gain, language)}
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                {t('transactions.cards.realized_pct')}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{t('transactions.tooltips.gain_loss_pct')}</p>
                  </TooltipContent>
                </Tooltip>
              </span>
              {gainPct !== null ? (
                <span
                  className={`font-semibold ${helpers.getGainColor(gainPct)}`}
                >
                  {helpers.formatPercentage(gainPct)}
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PositionsCards({
  history,
  currentPrice,
  className,
}: PositionsCardsProps) {
  const { t, i18n } = useTranslation();
  const helpers = usePositionsCardHelpers(history);

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className || ''}`}>
      <div className="flex gap-4">
        {history.map((entry, index) => (
          <div
            key={`${entry.timestamp}-${index}`}
            className={`flex-shrink-0 snap-start ${index === 0 ? 'pl-1' : ''}`}
          >
            {entry.is_buy ? (
              <BuyCard
                entry={entry}
                entryIndex={index}
                currentPrice={currentPrice}
                helpers={helpers}
                language={i18n.language}
                t={t}
              />
            ) : (
              <SellCard
                entry={entry}
                entryIndex={index}
                helpers={helpers}
                language={i18n.language}
                t={t}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PositionsCardsSkeleton({ className }: { className?: string }) {
  return (
    <div className={`overflow-x-auto ${className || ''}`}>
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={`flex-shrink-0 snap-start ${index === 0 ? 'pl-1' : ''}`}
          >
            <Card className="w-[18rem] sm:w-80 md:w-96 animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-20 mb-2" />
                <div className="h-3 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="border-t pt-2 mt-2 space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
