import { useUpdateNodeInternals } from '@xyflow/react';
import { TriggerNodeUI } from './trigger-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';

export type PriceChangesNode = Node<
  {
    value: string;
    direction: 'rises' | 'falls';
  },
  CustomNodeTypes.PriceChanges
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
}

export function PriceChangesNodeUI({
  value,
  direction,
  onValueChange,
  onDirectionChange,
  nodeId,
  preview,
}: PriceChangesNodeUIProps & CustomNodeProps) {
  return (
    <TriggerNodeUI nodeId={nodeId} preview={preview}>
      <div className="text-sm">Price of</div>
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
      {onDirectionChange ? (<select
        className="px-2 py-1 border rounded text-xs"
        value={direction}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onDirectionChange(e.target.value as 'rises' | 'falls')
        }
      >
        <option value="rises">rises</option>
        <option value="falls">falls</option>
      </select>) : (<div className="px-1">instrument changes</div>)}
    </TriggerNodeUI>
  );
}
