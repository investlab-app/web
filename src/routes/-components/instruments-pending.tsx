import { Star } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import SearchInput from '@/features/shared/components/ui/search-input';
import { ScrollableHorizontally } from '@/features/shared/components/scrollable-horizontally';
import { DataTable } from '@/features/shared/components/ui/data-table';
import { TableCell, TableRow } from '@/features/shared/components/ui/table';
import AppFrame from '@/features/shared/components/app-frame';
import { Sheet, SheetContent } from '@/features/shared/components/ui/sheet';

const InstrumentTableBodySkeleton = ({ rowCount = 5 }) => {
  return Array.from({ length: rowCount }).map((_, idx) => (
    <TableRow key={`skeleton-${idx}`}>
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
      columns={columns.map(() => ({
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
  return (
    <AppFrame>
      <Sheet open={true}>
        <SheetContent className="w-full sm:max-w-2/3 gap-0 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </SheetContent>

        <div className="flex flex-col gap-2">
          <SearchInput
            value=""
            onChange={() => {}}
            className="max-w-md"
            placeholder="Search..."
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
              <span>Watched</span>
            </Button>
          </div>

          <ScrollableHorizontally>
            <InstrumentsTableSkeleton />
          </ScrollableHorizontally>

          <div className="flex justify-center mt-4">
            <Button variant="outline" disabled>
              Loading...
            </Button>
          </div>
        </div>
      </Sheet>
    </AppFrame>
  );
};