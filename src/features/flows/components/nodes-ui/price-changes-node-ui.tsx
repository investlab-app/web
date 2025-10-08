import { TriggerNodeUI } from './trigger-node-ui';
import type { ChangeEvent } from 'react';

interface PriceChangesNodeUIProps {
  id: string;
  value: string;
  direction: 'rises' | 'falls';
  onValueChange?: (value: string) => void ;
  onDirectionChange?: (direction: 'rises' | 'falls') => void ;
}

export function PriceChangesNodeUI({
  id,
  value,
  direction,
  onValueChange,
  onDirectionChange,
}: PriceChangesNodeUIProps) {
  return (
    <TriggerNodeUI id={id}>
      <div className="text-sm">Price of instrument</div>
      <input
        className="w-full px-2 py-1 border rounded text-sm"
        type="text"
        placeholder="Ticker (e.g. AAPL)"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onValueChange!(e.target.value)
        }
      />
      <select
        className="w-full px-2 py-1 border rounded text-sm"
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
