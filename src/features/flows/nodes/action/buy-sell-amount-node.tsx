import { useUpdateNodeInternals } from '@xyflow/react';
import { ActionNodeUI } from './action-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

export type BuySellAmountNode = Node<
  {
    instrument: string;
    amount: number;
    action: string;
  },
  CustomNodeTypes.BuySellAmount
>;

export const BuySellAmountNode = (props: NodeProps<BuySellAmountNode>) => {
  const updateNodeInternals = useUpdateNodeInternals();

  return (
    <BuySellAmountNodeUI
      nodeId={props.id}
      instrument={props.data.instrument}
      amount={props.data.amount}
      action={props.data.action}
      onInstrumentChange={(val) => {
        props.data.instrument = val!;
        updateNodeInternals(props.id);
      }}
      onAmountChange={(val) => {
        props.data.amount = val!;
        updateNodeInternals(props.id);
      }}
      onActionChange={(val) => {
        props.data.action = val!;
        updateNodeInternals(props.id);
      }}
    />
  );
};

interface BuySellAmountNodeUIProps {
  instrument: string;
  onInstrumentChange?: (value: string | undefined) => void;
  amount: number;
  onAmountChange?: (value: number | undefined) => void;
  action: string;
  onActionChange?: (value: string) => void;
}

export function BuySellAmountNodeUI({
  instrument,
  onInstrumentChange,
  amount,
  onAmountChange,
  action,
  onActionChange,
  nodeId,
  preview,
}: BuySellAmountNodeUIProps & CustomNodeProps) {
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
      {onAmountChange && (
        <NumberInput
          className="w-30 mx-2"
          min={0}
          defaultValue={1}
          stepper={0.5}
          value={amount}
          onValueChange={onAmountChange}
          decimalScale={2}
        />
      )}
      {!onAmountChange && <div className="px-1">X</div>}
      <div className="text-sm">stock(s) of instrument</div>
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
    </ActionNodeUI>
  );
}
