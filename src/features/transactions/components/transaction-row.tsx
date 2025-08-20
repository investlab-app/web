import { useTranslation } from 'react-i18next';
import { getProfabilityColor } from '../utils/colors';
import type { HistoryEntry } from '../queries/fetch-transactions-history';
import { TableCell, TableRow } from '@/features/shared/components/ui/table';
import { Badge } from '@/features/shared/components/ui/badge';
import { dateToLocale } from '@/features/shared/utils/date';

interface HistoryRowProps {
  entry: HistoryEntry;
}

export function TransactionRow({ entry }: HistoryRowProps) {
  const { t, i18n } = useTranslation();

  return (
    <TableRow className="bg-muted/5">
      <TableCell className={`text-muted-foreground flex items-center gap-2`}>
        <Badge
          aria-label={dateToLocale(entry.date, i18n.language)}
          title={entry.date.toString()}
          variant="secondary"
          className="min-w-24"
        >
          {dateToLocale(entry.date, i18n.language)}
        </Badge>
        <Badge variant="outline" className="min-w-20">
          {entry.type === 'BUY'
            ? t('transactions.badge.buy')
            : t('transactions.badge.sell')}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {entry.quantity.toFixed(2)}
      </TableCell>
      <TableCell className="text-right text-muted-foreground">
        {entry.sharePrice.toFixed(2)} {t('common.currency')}
      </TableCell>
      <TableCell className="text-right text-muted-foreground">
        {entry.acquisitionPrice ? (
          <>
            {entry.acquisitionPrice.toFixed(2)} {t('common.currency')}
          </>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell className="text-right text-muted-foreground">
        {entry.marketValue.toFixed(2)} {t('common.currency')}
      </TableCell>
      <TableCell
        className={`text-right font-medium ${getProfabilityColor(entry.gainLoss)}`}
      >
        {entry.gainLoss.toFixed(2)} {t('common.currency')}
      </TableCell>
      <TableCell
        className={`text-right font-medium ${getProfabilityColor(entry.gainLoss)}`}
      >
        {entry.gainLossPct.toFixed(2)}%
      </TableCell>
    </TableRow>
  );
}
