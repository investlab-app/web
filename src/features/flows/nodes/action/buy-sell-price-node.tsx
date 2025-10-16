import { useUpdateNodeInternals } from '@xyflow/react';
import { ActionNodeUI } from './action-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

export type BuySellPriceNode = Node<
  {
    instrument: string;
    price: number;
    action: string;
  },
  CustomNodeTypes.BuySellPrice
>;

export const BuySellPriceNode = (props: NodeProps<BuySellPriceNode>) => {
  const updateNodeInternals = useUpdateNodeInternals();

  return (
    <BuySellPriceNodeUI
      nodeId={props.id}
      instrument={props.data.instrument}
      price={props.data.price}
      action={props.data.action}
      onInstrumentChange={(val) => {
        props.data.instrument = val!;
        updateNodeInternals(props.id);
      }}
      onPriceChange={(val) => {
        props.data.price = val!;
        updateNodeInternals(props.id);
      }}
      onActionChange={(val) => {
        props.data.action = val!;
        updateNodeInternals(props.id);
      }}
    />
  );
};

interface BuySellPriceNodeUIProps {
  instrument: string;
  onInstrumentChange?: (value: string | undefined) => void;
  price: number;
  onPriceChange?: (value: number | undefined) => void;
  action: string;
  onActionChange?: (value: string) => void;
}

export function BuySellPriceNodeUI({
  instrument,
  onInstrumentChange,
  price,
  onPriceChange,
  action,
  onActionChange,
  nodeId,
  preview,
}: BuySellPriceNodeUIProps & CustomNodeProps) {
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
      <div className="text-sm">for $</div>
      {onPriceChange && (
        <NumberInput
          className="w-24"
          min={0}
          defaultValue={1}
          stepper={0.5}
          value={price}
          onValueChange={onPriceChange}
          decimalScale={2}
        />
      )}
      {!onPriceChange && <div className="px-1">X</div>}
    </ActionNodeUI>
  );
}