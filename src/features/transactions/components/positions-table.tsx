import { useTranslation } from 'react-i18next';
import { Fragment } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/features/shared/components/ui/tooltip';

type PositionsTableProps = {
  type: 'open' | 'closed';
};

export function PositionsTable({ type }: PositionsTableProps) {
  const { data } = useQuery(transactionsHistoryQueryOptions({ type }));

  return (
    <Table className="rounded-md border">
      <PositionsTableHeader />
      <TableBody>
        {!data ? (
          <PositionsTableBodySkeleton />
        ) : (
          data.map((pos) => <PositionRow key={pos.name} position={pos} />)
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
        <TableHead>
          <div className="flex items-center gap-1">
            <span>{t('transactions.table.headers.name')}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t(
                    'transactions.tooltips.name',
                    'Name of the financial instrument'
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-1">
            <span>{t('transactions.table.headers.quantity')}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t(
                    'transactions.tooltips.quantity',
                    'Number of shares owned'
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableHead>
        <TableHead className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <span>{t('transactions.table.headers.share_price')}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t(
                    'transactions.tooltips.share_price',
                    'Current price per share'
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableHead>
        <TableHead className="hidden xl:table-cell text-right">
          <div className="flex items-center gap-1 justify-end">
            <span>{t('transactions.table.headers.acquisition_price')}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t(
                    'transactions.tooltips.acquisition_price',
                    'Average price paid per share'
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableHead>
        <TableHead className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <span>{t('transactions.table.headers.market_value')}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t(
                    'transactions.tooltips.market_value',
                    'Total current value of the position'
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableHead>
        <TableHead className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <span>{t('transactions.table.headers.gain_loss')}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t(
                    'transactions.tooltips.gain_loss',
                    'Absolute profit or loss amount'
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableHead>
        <TableHead className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <span>{t('transactions.table.headers.gain_loss_pct')}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t(
                    'transactions.tooltips.gain_loss_pct',
                    'Percentage profit or loss'
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function PositionsTableBodySkeleton({ length = 5 }) {
  const { t } = useTranslation();
  return (
    <>
      {Array.from({ length }).map((_, idx) => (
        <Fragment key={`skeleton-${idx}`}>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 rounded border border-transparent">
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {t(
                        'tooltips.transactions.expand_details',
                        'Expand to view transaction details'
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
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
          {Array.from({ length: Math.floor(Math.random() * 7) + 1 }).map(
            (_value, childIdx) => (
              <TableRow
                className="bg-muted/5"
                key={`skeleton-child-${idx}-${childIdx}`}
              >
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
            )
          )}
        </Fragment>
      ))}
    </>
  );
}
