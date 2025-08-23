import { type } from 'arktype';

export interface BuySellActionProps {
  mode: 'price' | 'volume';
  value: number;
  derivedValue: number;
  onValueChange: (val: number) => void;
  onModeToggle: () => void;
}

export const instrumentPrice = type({
  name: 'string',
  currentPrice: 'number',
  dayChange: 'number',
});
export type InstrumentPrice = typeof instrumentPrice.infer;
