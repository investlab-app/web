import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { InstrumentIconCircle } from './instrument-image-circle';
import type {
  ColumnDef,
  OnChangeFn,
  SortingState,
} from '@tanstack/react-table';
import type { Instrument } from '../types/instrument';
import { cn } from '@/features/shared/utils/styles';
import { toFixedLocalized } from '@/features/shared/utils/numbers';
import { Button } from '@/features/shared/components/ui/button';
import { DataTable } from '@/features/shared/components/ui/data-table';
import { TableCell, TableRow } from '@/features/shared/components/ui/table';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

interface InstrumentTableProps {
  data: Array<Instrument>;
  onInstrumentPressed: (instrument: Instrument) => void;
  rowCount?: number;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  isFetching?: boolean;
  isPending?: boolean;
}

export const InstrumentTable = ({
  data,
  onInstrumentPressed,
  rowCount = 10,
  sorting: controlledSorting,
  onSortingChange,
  isFetching,
  isPending,
}: InstrumentTableProps) => {
  const { t, i18n } = useTranslation();

  const columns: Array<ColumnDef<Instrument>> = [
    {
      accessorKey: 'symbol',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-mx-1.5! px-1.5!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {t('instruments.symbol')}
          {column.getIsSorted() === 'asc' ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <InstrumentIconCircle
            symbol={row.original.symbol}
            name={row.original.name}
            icon={row.original.icon}
            size="sm"
          />
          {row.original.symbol}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'name',
      header: () => (
        <div className="not-sm:hidden">{t('instruments.name')}</div>
      ),
      cell: ({ row }) => (
        <div className="not-sm:hidden">{row.original.name}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'currentPrice',
      header: () => (
        <div className={'text-right'}>{t('instruments.current_price')}</div>
      ),
      cell: ({ row }) => {
        const currentPrice = row.original.currentPrice;
        return (
          <div className="text-right">
            {currentPrice === null ? (
              <div className="text-muted-foreground text-right">N/A</div>
            ) : (
              <div className="text-right">
                {toFixedLocalized(currentPrice, i18n.language, 2)}{' '}
                {t('common.currency')}
              </div>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'todaysChange',
      header: () => (
        <div className="text-right">{t('instruments.day_change')}</div>
      ),
      cell: ({ row }) => {
        const dayChange = row.original.dayChange;
        return (
          <div className="text-right">
            {dayChange === null ? (
              <div className="text-muted-foreground text-right">N/A</div>
            ) : (
              <div
                className={cn(
                  dayChange < 0 ? 'text-[var(--red)]' : 'text-[var(--green)]'
                )}
              >
                {dayChange < 0 ? '-' : '+'}
                {toFixedLocalized(Math.abs(dayChange), i18n.language, 2)}%
              </div>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'volume',
      header: () => <div className="text-right">{t('instruments.volume')}</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.volume === null ? (
            <div className="text-muted-foreground">N/A</div>
          ) : (
            toFixedLocalized(row.original.volume, i18n.language, 0)
          )}
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowCount={rowCount}
      sorting={controlledSorting}
      onSortingChange={onSortingChange}
      onRowClick={(row) => onInstrumentPressed(row.original)}
      isFetching={isFetching}
      isPending={isPending}
      FetchingRowsSkeleton={<InstrumentTableBodySkeleton rowCount={rowCount} />}
    />
  );
};

function InstrumentTableBodySkeleton({ rowCount = 5 }) {
  return Array.from({ length: rowCount }).map((_, idx) => (
    <TableRow key={`skeleton-${idx}`}>
      <TableCell className="h-10 flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-8" />
      </TableCell>
      <TableCell className="h-10">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="h-10">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="h-10">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="h-10">
        <Skeleton className="h-4 w-16" />
      </TableCell>
    </TableRow>
  ));
}
