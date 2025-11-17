import { useTranslation } from 'react-i18next';

import { PredefinedOptionsSelect } from '../../components/predefined-options-select';
import { BUY_SELL_OPTIONS } from '../../constants/node-options';
import { ActionNodeUI } from './action-node-ui';
import type { BuySellAction } from '../../types/input-options-types';
import type { CustomNodeProps } from '../../types/node-props';
import type { ChangeEvent } from 'react';

import { NumberInput } from '@/features/shared/components/ui/number-input';

interface BuySellAmountNodeUIProps {
  instrument?: string;
  onInstrumentChange?: (value: string | undefined) => void;
  amount?: number;
  onAmountChange?: (value: number | undefined) => void;
  action?: BuySellAction;
  onActionChange?: (value: BuySellAction) => void;
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
  const { t } = useTranslation();
  return (
    <ActionNodeUI preview={preview} nodeId={nodeId}>
      {onActionChange ? (
        <PredefinedOptionsSelect
          value={action}
          onChange={onActionChange}
          options={BUY_SELL_OPTIONS}
          className="px-2 py-1 border rounded"
        />
      ) : (
        <div className="px-1">{t('flows.placeholders.buy_sell')}</div>
      )}
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
