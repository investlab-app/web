import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPercentage, getGainColor } from '../utils/card-helpers';
import type { HistoryEntry } from '@/client';
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
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipTrigger,
} from '@/features/shared/components/ui/hybrid-tooltip';
import { withCurrency } from '@/features/shared/utils/numbers';

interface BuyCardProps {
  entry: HistoryEntry;
  open: boolean;
}

export function BuyCard({ entry, open }: BuyCardProps) {
  const { t, i18n } = useTranslation();

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
              {open
                ? t('transactions.cards.current_value')
                : t('transactions.cards.sell_value')}
            </span>
            <span className="font-medium">
              {withCurrency(entry.final_transaction_value, i18n.language)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t('common.quantity')}
            </span>
            <span className="font-medium">{entry.quantity}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t('transactions.cards.price_at_buy')}
            </span>
            <span className="font-medium">
              {withCurrency(entry.initial_share_price, i18n.language)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {open
                ? t('transactions.cards.current_share_price')
                : t('transactions.cards.price_at_sell')}
            </span>
            <span className="font-medium">
              {withCurrency(entry.final_share_price, i18n.language)}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              {t('transactions.cards.gain_loss')}
              <HybridTooltip>
                <HybridTooltipTrigger asChild>
                  <Info className="size-2.5 cursor-help" />
                </HybridTooltipTrigger>
                <HybridTooltipContent className="max-w-xs">
                  <p>{t('transactions.tooltips.gain_loss')}</p>
                </HybridTooltipContent>
              </HybridTooltip>
            </span>

            <span className={`font-medium ${getGainColor(entry.gain)}`}>
              {withCurrency(entry.gain, i18n.language)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              {t('transactions.cards.gain_loss_pct')}
              <HybridTooltip>
                <HybridTooltipTrigger asChild>
                  <Info className="size-2.5 cursor-help" />
                </HybridTooltipTrigger>
                <HybridTooltipContent className="max-w-xs">
                  <p>{t('transactions.tooltips.gain_loss_pct')}</p>
                </HybridTooltipContent>
              </HybridTooltip>
            </span>

            <span
              className={`font-medium ${getGainColor(entry.gain_percentage)}`}
            >
              {formatPercentage(entry.gain_percentage)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
