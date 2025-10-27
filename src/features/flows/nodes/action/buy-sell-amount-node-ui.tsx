import { BuySellSelect } from '../../components/buy-sell-select';
import { ActionNodeUI } from './action-node-ui';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface BuySellAmountNodeUIProps {
  instrument?: string;
  onInstrumentChange?: (value: string | undefined) => void;
  amount?: number;
  onAmountChange?: (value: number | undefined) => void;
  action?: string;
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
      <BuySellSelect action={action} onActionChange={onActionChange} />
      {!onActionChange && <div>X</div>}
      {onAmountChange && (
        <NumberInput
          className="w-40 mx-2"
          min={0}
          defaultValue={1}
          stepper={0.1}
          value={amount}
          onValueChange={onAmountChange}
          decimalScale={5}
          fixedDecimalScale={true}
        />
      )}
      {onInstrumentChange && (
        <input
          className="px-2 py-1 border rounded"
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
