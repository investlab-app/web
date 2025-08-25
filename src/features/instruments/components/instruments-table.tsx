import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import type { Instrument } from '@/features/instruments/types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/components/ui/table';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

type InstrumentTableProps = {
  data: Array<Instrument>;
  onInstrumentPressed: (instrument: Instrument) => void;
};

const InstrumentTable = ({
  data,
  onInstrumentPressed,
}: InstrumentTableProps) => {
  const { t } = useTranslation();

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'name',
        header: () => t('instruments.name'),
      },
      {
        accessorKey: 'symbol',
        header: () => t('instruments.symbol'),
      },
      {
        accessorKey: 'currentPrice',
        header: () => t('instruments.current_price'),
      },
      {
        accessorKey: 'dayChange',
        header: () => t('instruments.day_change'),
      },
      {
        accessorKey: 'volume',
        header: () => t('instruments.volume'),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            onClick={() => onInstrumentPressed(row.original)}
            className="cursor-pointer"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

type InstrumentTableSkeletonProps = {
  rowCount: number;
};

function InstrumentTableSkeleton({ rowCount }: InstrumentTableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden sm:table-cell">
            <Skeleton className="h-4 w-32" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-16" />
          </TableHead>
          <TableHead className="text-right">
            <Skeleton className="h-4 w-20 ml-auto" />
          </TableHead>
          <TableHead className="text-right">
            <Skeleton className="h-4 w-16 ml-auto" />
          </TableHead>
          <TableHead className="text-right">
            <Skeleton className="h-4 w-16 ml-auto" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, idx) => (
          <TableRow key={`skeleton-${idx}`}>
            <TableCell className="hidden sm:table-cell">
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

InstrumentTable.Skeleton = InstrumentTableSkeleton;

export default InstrumentTable;
