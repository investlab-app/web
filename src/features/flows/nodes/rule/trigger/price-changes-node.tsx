import { useUpdateNodeInternals } from '@xyflow/react';
import { TriggerNodeUI } from './trigger-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { TriggerNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';

export type PriceChangesNode = Node<
  {
    value: string;
    direction: 'rises' | 'falls';
  },
  TriggerNodeTypes.PriceChanges
>;

export const PriceChangesNode = (props: NodeProps<PriceChangesNode>) => {
  const updateNodeInternals = useUpdateNodeInternals();

  return (
    <PriceChangesNodeUI
      value={props.data.value}
      direction={props.data.direction}
      onValueChange={(val) => {
        props.data.value = val;
        updateNodeInternals(props.id);
      }}
      onDirectionChange={(dir) => {
        props.data.direction = dir;
        updateNodeInternals(props.id);
      }}
      nodeId={props.id}
    />
  );
};

interface PriceChangesNodeUIProps {
  value: string;
  direction: 'rises' | 'falls';
  onValueChange?: (value: string) => void;
  onDirectionChange?: (direction: 'rises' | 'falls') => void;
  nodeId: string;
}

export function PriceChangesNodeUI({
  value,
  direction,
  onValueChange,
  onDirectionChange,
  nodeId,
}: PriceChangesNodeUIProps) {
  return (
    <TriggerNodeUI nodeId={nodeId}>
      <div className="text-sm px-1">Price of instrument</div>
      {onValueChange && (
        <input
          className="mx-2 px-2 py-1 border rounded text-xs"
          type="text"
          placeholder="AAPL"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onValueChange(e.target.value)
          }
        />
      )}
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
