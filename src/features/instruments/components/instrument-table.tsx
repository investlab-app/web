import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Instrument } from '../helpers/instrument';

type InstrumentTableProps = {
  data: Array<Instrument>;
  onInstrumentPressed: (instrument: Instrument) => void;
};

const InstrumentTable = ({
  data,
  onInstrumentPressed,
}: InstrumentTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>Day Change</TableHead>
            <TableHead>Volume</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((instrument, idx) => (
            <TableRow
              key={idx}
              onClick={() => onInstrumentPressed(instrument)}
              className="cursor-pointer"
            >
              <TableCell className="text-white">{instrument.name}</TableCell>
              <TableCell className="text-white">{instrument.symbol}</TableCell>
              <TableCell className="text-white">
                ${instrument.currentPrice.toFixed(2)}
              </TableCell>
              <TableCell className="text-white">
                <span
                  className={
                    instrument.dayChange < 0 ? 'text-red-500' : 'text-green-500'
                  }
                >
                  {instrument.dayChange < 0 ? '-' : '+'}
                  {Math.abs(instrument.dayChange).toFixed(2)}%
                </span>
              </TableCell>
              <TableCell className="text-white">{instrument.volume}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstrumentTable;
