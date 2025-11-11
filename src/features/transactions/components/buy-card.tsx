import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { HistoryEntry } from '@/client';
import type { PositionsCardHelpers } from '../hooks/use-positions-card-helpers';
import { cn } from '@/features/shared/utils/styles';
import { dateToLocale } from '@/features/shared/utils/date';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Badge } from '@/features/shared/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/features/shared/components/ui/tooltip';
import { withCurrency } from '@/features/shared/utils/numbers';

interface BuyCardProps {
  entry: HistoryEntry;
  entryIndex: number;
  currentPrice?: number;
  helpers: PositionsCardHelpers;
}

export function BuyCard({
  entry,
  entryIndex,
  currentPrice,
  helpers,
}: BuyCardProps) {
  const { t, i18n } = useTranslation();
  const gain = helpers.calculateNumericalGain(entry, entryIndex, currentPrice);
  const gainPct = helpers.calculatePercentageGain(entry, gain, entryIndex);

  return (
    <Card
      className={cn(
        'flex-shrink-0 snap-start transition-colors h-full rounded-none',
        'w-[16rem] sm:w-72 md:w-80',
        'hover:bg-accent/40',
        'py-4'
      )}
    >
      <CardHeader className="px-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="default" className="mb-2 text-xs">
              {t('transactions.badge.buy')}
            </Badge>
            <CardTitle className="text-xs text-muted-foreground">
              {dateToLocale(entry.timestamp, i18n.language)}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 flex flex-col h-full">
        <div className="space-y-2 flex-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t('transactions.table.headers.quantity')}
            </span>
            <span className="font-medium">{entry.quantity}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t('transactions.table.headers.share_price')}
            </span>
            <span className="font-medium">
              {withCurrency(entry.share_price, i18n.language)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t('transactions.cards.current_price')}
            </span>
            <span className="font-medium">
              {currentPrice
                ? withCurrency(currentPrice, i18n.language)
                : '—'}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              {t('transactions.table.headers.gain_loss')}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-2.5 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t('transactions.tooltips.gain_loss')}</p>
                </TooltipContent>
              </Tooltip>
            </span>
            {gain !== null ? (
              <span className={`font-medium ${helpers.getGainColor(gain)}`}>
                {withCurrency(gain, i18n.language)}
              </span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              {t('transactions.table.headers.gain_loss_pct')}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-2.5 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t('transactions.tooltips.gain_loss_pct')}</p>
                </TooltipContent>
              </Tooltip>
            </span>
            {gainPct !== null ? (
              <span className={`font-medium ${helpers.getGainColor(gainPct)}`}>
                {helpers.formatPercentage(gainPct)}
              </span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}