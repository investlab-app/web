import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/features/shared/components/ui/button';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import SearchInput from '@/features/shared/components/ui/search-input';
import { ScrollableHorizontally } from '@/features/shared/components/scrollable-horizontally';
import { DataTable } from '@/features/shared/components/ui/data-table';
import { TableCell, TableRow } from '@/features/shared/components/ui/table';
import AppFrame from '@/features/shared/components/app-frame';

const InstrumentTableBodySkeleton = ({ rowCount = 5 }) => {
  return Array.from({ length: rowCount }).map((_, idx) => (
    <TableRow
      key={`skeleton-${idx}`}
      data-testid="pending-state-data-table-row"
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-20 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-24 ml-auto" />
      </TableCell>
    </TableRow>
  ));
};

const InstrumentsTableSkeleton = () => {
  const columns = Array(6).fill(null); // Match the number of columns in the actual table

  return (
    <DataTable
      data-testid={'instrument-table-loading'}
      columns={columns.map((_, index) => ({
        id: `skeleton-${index}`,
        accessorKey: '',
        header: () => <Skeleton className="h-4 w-16" />,
        cell: () => null,
      }))}
      data={[]}
      FetchingRowsSkeleton={<InstrumentTableBodySkeleton rowCount={10} />}
    />
  );
};

export const InstrumentsPending = () => {
  const { t } = useTranslation();

  return (
    <AppFrame>
      <div className="flex flex-col gap-2">
        <SearchInput
          value=""
          onChange={() => {}}
          className="max-w-md"
          placeholder={t('common.search')}
          disabled
        />

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            disabled
          >
            <Star className="size-4" />
            <span>{t('common.watched')}</span>
          </Button>
        </div>

        <ScrollableHorizontally>
          <InstrumentsTableSkeleton />
        </ScrollableHorizontally>

        <div className="flex justify-center mt-4">
          <Button variant="outline" disabled>
            {t('common.loading')}
          </Button>
        </div>
      </div>
    </AppFrame>
  );
};
