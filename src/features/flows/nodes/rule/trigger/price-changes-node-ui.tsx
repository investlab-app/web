import { TriggerNodeUI } from './trigger-node-ui';
import type { ChangeEvent } from 'react';

interface PriceChangesNodeUIProps {
  value: string;
  direction: 'rises' | 'falls';
  onValueChange?: (value: string) => void;
  onDirectionChange?: (direction: 'rises' | 'falls') => void;
}

export function PriceChangesNodeUI({
  value,
  direction,
  onValueChange,
  onDirectionChange,
}: PriceChangesNodeUIProps) {
  return (
    <TriggerNodeUI>
      <div className="text-sm px-1">Price of instrument</div>
     {onValueChange && ( <input
        className="mx-2 px-2 py-1 border rounded text-xs"
        type="text"
        placeholder="AAPL"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onValueChange(e.target.value)
        }
      />)}
      <select
        className="px-2 py-1 border rounded text-xs"
        value={direction}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onDirectionChange!(e.target.value as 'rises' | 'falls')
        }
      >
        <option value="rises">rises</option>
        <option value="falls">falls</option>
      </select>
    </TriggerNodeUI>
  );
}
