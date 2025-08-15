import { useTranslation } from 'react-i18next';
import type { Instrument } from '../types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/styles';

type InstrumentTableProps = {
  data: Array<Instrument>;
  onInstrumentPressed: (instrument: Instrument) => void;
  rowCount?: number;
  loading?: boolean;
};

const InstrumentTable = ({
  data,
  onInstrumentPressed,
  rowCount = 10,
  loading = false,
}: InstrumentTableProps) => {
  const { t } = useTranslation();

  const renderSkeletonRows = () => {
    return Array.from({ length: rowCount }).map((_, idx) => (
      <TableRow key={`skeleton-${idx}`}>
        <TableCell className="hidden sm:table-cell h-10">
          <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell className="h-10">
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell className="text-right h-10">
          <Skeleton className="h-4 w-20 ml-auto" />
        </TableCell>
        <TableCell className="text-right h-10">
          <Skeleton className="h-4 w-16 ml-auto" />
        </TableCell>
        <TableCell className="text-right h-10">
          <Skeleton className="h-4 w-16 ml-auto" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden sm:table-cell">
              {t('instruments.name')}
            </TableHead>
            <TableHead>{t('instruments.symbol')}</TableHead>
            <TableHead className="text-right">
              {t('instruments.current_price')}
            </TableHead>
            <TableHead className="text-right">
              {t('instruments.day_change')}
            </TableHead>
            <TableHead className="text-right">
              {t('instruments.volume')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? renderSkeletonRows()
            : data.map((instrument, idx) => (
                <TableRow
                  key={idx}
                  onClick={() => onInstrumentPressed(instrument)}
                  className="cursor-pointer"
                >
                  <TableCell className="hidden sm:table-cell">
                    {instrument.name}
                  </TableCell>
                  <TableCell>{instrument.symbol}</TableCell>
                  <TableCell className="text-right">
                    {instrument.currentPrice.toFixed(2)} {t('common.currency')}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right',
                      instrument.dayChange < 0
                        ? 'text-red-500'
                        : 'text-green-500'
                    )}
                  >
                    {instrument.dayChange < 0 ? '-' : '+'}
                    {Math.abs(instrument.dayChange).toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {instrument.volume}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstrumentTable;
