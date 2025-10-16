import { useUpdateNodeInternals } from '@xyflow/react';
import { ActionNodeUI } from './action-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

export type BuySellPercentNode = Node<
  {
    instrument: string;
    percent: number;
    action: string;
  },
  CustomNodeTypes.BuySellPercent
>;

export const BuySellPercentNode = (props: NodeProps<BuySellPercentNode>) => {
  const updateNodeInternals = useUpdateNodeInternals();

  return (
    <BuySellPercentNodeUI
      nodeId={props.id}
      instrument={props.data.instrument}
      percent={props.data.percent}
      action={props.data.action}
      onInstrumentChange={(val) => {
        props.data.instrument = val!;
        updateNodeInternals(props.id);
      }}
      onPercentChange={(val) => {
        props.data.percent = val!;
        updateNodeInternals(props.id);
      }}
      onActionChange={(val) => {
        props.data.action = val!;
        if (val === 'sell' && props.data.percent > 100) {
    props.data.percent = 100;
  }
        updateNodeInternals(props.id);
      }}
    />
  );
};

interface BuySellPercentNodeUIProps {
  instrument: string;
  onInstrumentChange?: (value: string | undefined) => void;
  percent: number;
  onPercentChange?: (value: number | undefined) => void;
  action: string;
  onActionChange?: (value: string) => void;
}

export function BuySellPercentNodeUI({
  instrument,
  onInstrumentChange,
  percent,
  onPercentChange,
  action,
  onActionChange,
  nodeId,
  preview,
}: BuySellPercentNodeUIProps & CustomNodeProps) {
  return (
    <ActionNodeUI preview={preview} nodeId={nodeId}>
      {onActionChange && (
        <select
          className="px-2 py-1 border rounded text-xs"
          value={action}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onActionChange(e.target.value as 'buy' | 'sell')
          }
        >
          <option value="buy">buy</option>
          <option value="sell">sell</option>
        </select>
      )}
      {!onActionChange && <div className="px-1">buy/sell</div>}
      {onPercentChange && (
        <NumberInput
          className="w-20 mx-2"
          min={0}
          max={action === 'sell' ? 100 : undefined}
          defaultValue={10}
          stepper={5}
          value={percent}
          onValueChange={(val) => {
            // Ensure the value doesn't exceed 100 for sell action
            if (action === 'sell' && val && val > 100) {
              onPercentChange(100);
            } else {
              onPercentChange(val);
            }
          }}
          decimalScale={0}
        />
      )}
      {!onPercentChange && <div className="px-1">X</div>}
      <div className="text-sm">percent of owned</div>
      {onInstrumentChange && (
        <input
          className="mx-2 px-2 py-1 border rounded text-xs"
          type="text"
          placeholder="AAPL"
          value={instrument}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onInstrumentChange(e.target.value)
          }
        />
      )}
      <div className="text-sm">stock</div>
    </ActionNodeUI>
  );
}