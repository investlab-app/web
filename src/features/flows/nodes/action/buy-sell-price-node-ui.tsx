import { useTranslation } from 'react-i18next';

import { PredefinedOptionsSelect } from '../../components/predefined-options-select';
import { BUY_SELL_OPTIONS } from '../../constants/node-options';
import { ActionNodeUI } from './action-node-ui';
import type { BuySellAction } from '../../types/input-options-types';
import type { CustomNodeProps } from '../../types/node-props';
import type { ChangeEvent } from 'react';

import { NumberInput } from '@/features/shared/components/ui/number-input';

interface BuySellPriceNodeUIProps {
  instrument: string;
  onInstrumentChange?: (value: string | undefined) => void;
  price?: number;
  onPriceChange?: (value: number | undefined) => void;
  action: BuySellAction;
  onActionChange?: (value: BuySellAction) => void;
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
      {onInstrumentChange && (
        <input
          className="mx-2 px-2 py-1 border rounded"
          type="text"
          placeholder="AAPL"
          value={instrument}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onInstrumentChange(e.target.value)
          }
        />
      )}
      <div>{t('flows.nodes.for')}</div>
      {onPriceChange && (
        <NumberInput
          className="w-35 ml-2"
          min={0}
          defaultValue={100}
          prefix="$"
          stepper={50}
          value={price}
          onValueChange={onPriceChange}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      )}
      {!onPriceChange && <div className="px-1">$X</div>}
    </ActionNodeUI>
  );
}
