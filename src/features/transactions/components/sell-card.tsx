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
import { withCurrency } from '@/features/shared/utils/numbers';

interface SellCardProps {
  entry: HistoryEntry;
  entryIndex: number;
  helpers: PositionsCardHelpers;
}

export function SellCard({
  entry,
  entryIndex,
  helpers,
}: SellCardProps) {
  const { t, i18n } = useTranslation();

  const avgBuyPrice = helpers.calculateAverageBuyPrice(entryIndex);

  return (
    <Card
      className={cn(
        'flex-shrink-0 snap-start transition-colors h-full rounded-none',
        'w-[16rem] sm:w-72 md:w-80',
        'hover:bg-accent/40',
        'py-4 h-56'
      )}
    >
      <CardHeader className="px-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="secondary" className="mb-2 text-xs">
              {t('transactions.badge.sell')}
            </Badge>
            <CardTitle className="text-xs text-muted-foreground">
              {dateToLocale(entry.timestamp, i18n.language)}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 space-y-2 flex flex-col">
        <div className="space-y-2 flex-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t('transactions.table.headers.quantity')}
            </span>
            <span className="font-medium">{entry.quantity}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t('transactions.cards.sold_at')}{' '}
              {t('transactions.table.headers.share_price')}
            </span>
            <span className="font-medium">
              {withCurrency(entry.share_price, i18n.language)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t('transactions.cards.avg_buy_price')}
            </span>
            <span className="font-medium">
              {avgBuyPrice !== null ? withCurrency(avgBuyPrice, i18n.language) : '—'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
