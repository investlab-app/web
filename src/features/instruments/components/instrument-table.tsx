import { ArrowDown, ArrowUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Instrument {
  name: string;
  quantity: number;
  currentPrice: number;
  marketValue: number;
  percentPL: number;
  dollarPL: number;
}

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
            <TableHead>Asset Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>Market Value</TableHead>
            <TableHead>% Total P/L</TableHead>
            <TableHead>$ Total P/L</TableHead>
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
              <TableCell className="text-white">
                {instrument.quantity}
              </TableCell>
              <TableCell className="text-white">
                ${instrument.currentPrice.toFixed(2)}
              </TableCell>
              <TableCell className="text-white">
                ${instrument.marketValue.toFixed(2)}
              </TableCell>
              <TableCell className="text-white">
                <span
                  className={`inline-flex items-center gap-1 ${
                    instrument.percentPL < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {instrument.percentPL < 0 ? (
                    <ArrowDown size={14} />
                  ) : (
                    <ArrowUp size={14} />
                  )}
                  {Math.abs(instrument.percentPL).toFixed(2)}%
                </span>
              </TableCell>
              <TableCell className="text-white">
                <span
                  className={
                    instrument.dollarPL < 0 ? 'text-red-500' : 'text-green-500'
                  }
                >
                  {instrument.dollarPL < 0 ? '-' : '+'}$
                  {Math.abs(instrument.dollarPL).toFixed(2)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstrumentTable;
