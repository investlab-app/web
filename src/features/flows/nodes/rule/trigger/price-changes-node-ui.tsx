import { TriggerNodeUI } from './trigger-node-ui';
import type { ChangeEvent } from 'react';

interface PriceChangesNodeUIProps {
  id: string;
  value: string;
  direction: 'rises' | 'falls';
  onValueChange?: (value: string) => void;
  onDirectionChange?: (direction: 'rises' | 'falls') => void;
  connectionsLen?: number;
}

export function PriceChangesNodeUI({
  id,
  value,
  direction,
  onValueChange,
  onDirectionChange,
  connectionsLen,
}: PriceChangesNodeUIProps) {
  return (
    <TriggerNodeUI id={id} connectionsLen={connectionsLen}>
      <div className="text-sm px-1">Price of instrument</div>
      <input
        className="w-full px-2 py-1 border rounded text-xs"
        type="text"
        placeholder="AAPL"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onValueChange!(e.target.value)
        }
      />
      <select
        className="w-full px-2 py-1 border rounded text-xs"
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
