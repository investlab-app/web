import { useUpdateNodeInternals } from '@xyflow/react';
import { TriggerNodeUI } from './trigger-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';

export type InstrumentBoughtSoldNode = Node<
  {
    value: string;
    action: 'bought' | 'sold';
  },
  CustomNodeTypes.InstrumentBoughtSold
>;

export const InstrumentBoughtSoldNode = (props: NodeProps<InstrumentBoughtSoldNode>) => {
  const updateNodeInternals = useUpdateNodeInternals();

  return (
    <InstrumentBoughtSoldNodeUI
      value={props.data.value}
      action={props.data.action}
      onValueChange={(val) => {
        props.data.value = val;
        updateNodeInternals(props.id);
      }}
      onActionChange={(act) => {
        props.data.action = act;
        updateNodeInternals(props.id);
      }}
      nodeId={props.id}
    />
  );
};

interface InstrumentBoughtSoldNodeUIProps {
  value: string;
  action: 'bought' | 'sold';
  onValueChange?: (value: string) => void;
  onActionChange?: (action: 'bought' | 'sold') => void;
}

export function InstrumentBoughtSoldNodeUI({
  value,
  action,
  onValueChange,
  onActionChange,
  nodeId,
  preview,
}: InstrumentBoughtSoldNodeUIProps & CustomNodeProps) {
  return (
    <TriggerNodeUI nodeId={nodeId} preview={preview}>
      <div className="text-sm px-1">Instrument</div>
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
        value={action}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onActionChange!(e.target.value as 'bought' | 'sold')
        }
      >
        <option value="bought">bought</option>
        <option value="sold">sold</option>
      </select>
    </TriggerNodeUI>
  );
}