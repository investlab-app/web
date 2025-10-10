import { PredicateNodeUI } from './predicate-node-ui';
import type { ChangeEvent } from 'react';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface PriceHigherLowerNodeUIProps {
  value: number;
  state: 'over' | 'under';
  onValueChange?: (value: number | undefined) => void;
  onStateChange?: (state: 'over' | 'under') => void;
  connectionsLen?: number;
}

export function PriceHigherLowerNodeUI({
  value,
  state,
  onValueChange,
  onStateChange,
  connectionsLen,
}: PriceHigherLowerNodeUIProps) {
  return (
    <PredicateNodeUI connectionsLen={connectionsLen}>
      <div className="text-sm px-1">Price</div>
      <select
        className="mx-2 px-2 py-1 border rounded text-xs"
        value={state}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onStateChange!(e.target.value as 'over' | 'under')
        }
      >
        <option value="over">over</option>
        <option value="under">under</option>
      </select>
      {onValueChange && (<NumberInput
        className="text-xs w-30"
         min={1}
         stepper={50}
          defaultValue={100.00}
          value={value}
          onValueChange={onValueChange}
          decimalScale={2}
       
      />)}
      {!onValueChange && <div className="px-1">X</div>}
    </PredicateNodeUI>
  );
}
