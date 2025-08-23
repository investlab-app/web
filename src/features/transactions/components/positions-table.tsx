import { useTranslation } from 'react-i18next';
import { Fragment } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { transactionsHistoryQueryOptions } from '../queries/fetch-transactions-history';
import { PositionRow } from './position-row';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/components/ui/table';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

type PositionsTableProps = {
  type: 'open' | 'closed';
};

export function PositionsTable({ type }: PositionsTableProps) {
  const { navigate } = useRouter();
  const { getToken } = useAuth();

  const { data } = useQuery(
    transactionsHistoryQueryOptions({ type, getToken })
  );

  return (
    <Table>
      {PositionsTableHeader()}
      <TableBody>
        {!data ? (
          <PositionsTableSkeleton />
        ) : (
          data.map((pos) => (
            <PositionRow
              key={pos.name}
              position={pos}
              showDetails={() => navigate({ to: `/instruments/${pos.name}` })}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}

export function PositionsTableHeader() {
  const { t } = useTranslation();
  return (
    <TableHeader>
      <TableRow>
        <TableHead style={{ width: '250px' }}>
          {t('transactions.table.headers.name')}
        </TableHead>
        <TableHead>{t('transactions.table.headers.quantity')}</TableHead>
        <TableHead className="text-right">
          {t('transactions.table.headers.share_price')}
        </TableHead>
        <TableHead className="hidden xl:table-cell text-right">
          {t('transactions.table.headers.acquisition_price')}
        </TableHead>
        <TableHead className="text-right">
          {t('transactions.table.headers.market_value')}
        </TableHead>
        <TableHead className="text-right">
          {t('transactions.table.headers.gain_loss')}
        </TableHead>
        <TableHead className="text-right">
          {t('transactions.table.headers.gain_loss_pct')}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function PositionsTableSkeleton({ length = 5 }) {
  const { t } = useTranslation();
  return (
    <>
      {Array.from({ length }).map((_, idx) => (
        <Fragment key={`skeleton-${idx}`}>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded border border-transparent">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  className="p-1 rounded border border-transparent"
                  title={t('transactions.actions.instrument_details')}
                >
                  <Skeleton className="h-4 w-24" />
                </button>
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-14" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16 ml-auto" />
            </TableCell>
          </TableRow>
          {Array.from({ length: Math.floor(Math.random() * 7) + 1 }).map(() => (
            <TableRow className="bg-muted/5">
              <TableCell>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-14" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </Fragment>
      ))}
    </>
  );
}
