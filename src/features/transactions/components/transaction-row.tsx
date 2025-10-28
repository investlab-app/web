import { useTranslation } from 'react-i18next';
import type { HistoryEntry } from '@/client/types.gen';
import { TableCell, TableRow } from '@/features/shared/components/ui/table';
import { Badge } from '@/features/shared/components/ui/badge';
import { dateToLocale } from '@/features/shared/utils/date';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

interface HistoryRowProps {
  entry: HistoryEntry;
}

export function TransactionRow({ entry }: HistoryRowProps) {
  const { t, i18n } = useTranslation();

  return (
    <TableRow className="bg-muted/5">
      <TableCell className={`text-muted-foreground flex items-center gap-2`}>
        <Badge
          aria-label={dateToLocale(entry.timestamp, i18n.language)}
          title={entry.timestamp}
          variant="secondary"
          className="min-w-24"
        >
          {dateToLocale(entry.timestamp, i18n.language)}
        </Badge>
        <Badge variant="outline" className="min-w-20">
          {entry.is_buy
            ? t('transactions.badge.buy')
            : t('transactions.badge.sell')}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {toFixedLocalized(entry.quantity, i18n.language, 2)}
      </TableCell>
      <TableCell className="text-right text-muted-foreground">
        {toFixedLocalized(entry.share_price, i18n.language, 2)}
      </TableCell>
      <TableCell className="hidden xl:table-cell text-right text-muted-foreground">
        {entry.acquisition_price ? (
          <>{toFixedLocalized(entry.acquisition_price, i18n.language, 2)}</>
        ) : (
          'N/A'
        )}
      </TableCell>
    </TableRow>
  );
}
