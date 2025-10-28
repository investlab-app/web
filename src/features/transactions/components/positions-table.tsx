import { useTranslation } from 'react-i18next';
import { Fragment } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PositionRow } from './position-row';
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/components/ui/table';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { statisticsTransactionsHistoryListOptions } from '@/client/@tanstack/react-query.gen';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/features/shared/components/ui/tooltip';
import { Button } from '@/features/shared/components/ui/button';
import { ErrorMessage } from '@/features/shared/components/error-message';
import { EmptyMessage } from '@/features/shared/components/empty-message';

type PositionsTableProps = {
  type: 'open' | 'closed';
};

export function PositionsTable({ type }: PositionsTableProps) {
  const { t } = useTranslation();
  const { data, isPending, isError } = useQuery(
    statisticsTransactionsHistoryListOptions({ query: { type } })
  );

  if (isError) {
    return (
      <ErrorMessage message="Error loading positions. Please try again later." />
    );
  }

  if (isPending) {
    return <PositionsTableBodySkeleton length={5} />;
  }

  if (data.length === 0) {
    return (
      <EmptyMessage
        message={t('transactions.no_open_positions')}
        cta={{
          to: '/instruments',
          label: t('instruments.browse_instruments'),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {data.map((pos) => (
        <PositionRow key={pos.name} position={pos} />
      ))}
    </div>
  );
}

export function PositionsTableHeader({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <TableHeader className={`bg-muted ${className}`}>
      <TableHead>
        <div className="flex items-center gap-1">
          <span>{t('transactions.table.headers.name')}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('transactions.tooltips.name')}</p>
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
              <p>{t('transactions.tooltips.quantity')}</p>
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
              <p>{t('transactions.tooltips.share_price')}</p>
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
              <p>{t('transactions.tooltips.acquisition_price')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableHead>
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
                <Button variant={'ghost'} className="size-8" disabled>
                  <ChevronDown className="h-4 w-4" />
                </Button>
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
