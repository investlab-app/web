import { useTranslation } from 'react-i18next';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
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
        {entry.type === 'BUY' ? (
          <Badge
            variant="outline"
            className="border-green-500 text-green-400 flex items-center gap-1 w-24 justify-center"
          >
            <ArrowUpRight className="h-3 w-3" /> {t('transactions.badge.buy')}
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-red-500 text-red-400 flex items-center gap-1 w-24 justify-center"
          >
            <ArrowDownRight className="h-3 w-3" />{' '}
            {t('transactions.badge.sell')}
          </Badge>
        )}
        <Badge
          aria-label={dateToLocale(entry.date, i18n.language)}
          title={entry.date.toString()}
          variant="secondary"
          className="text-muted-foreground bg-muted"
        >
          {dateToLocale(entry.date, i18n.language)}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {entry.quantity.toFixed(2)}
      </TableCell>
      <TableCell className="text-right text-muted-foreground">
        @{entry.sharePrice.toFixed(2)} {t('common.currency')}
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
