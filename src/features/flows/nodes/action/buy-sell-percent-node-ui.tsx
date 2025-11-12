import { useTranslation } from 'react-i18next';

import { PredefinedOptionsSelect } from '../../components/predefined-options-select';
import { BUY_SELL_OPTIONS } from '../../constants/node-options';
import { BuySellAction } from '../../types/input-options-types';
import { ActionNodeUI } from './action-node-ui';
import type { CustomNodeProps } from '../../types/node-props';
import type { ChangeEvent } from 'react';

import { NumberInput } from '@/features/shared/components/ui/number-input';

interface BuySellPercentNodeUIProps {
  instrument: string;
  onInstrumentChange?: (value: string | undefined) => void;
  percent?: number;
  onPercentChange?: (value: number | undefined) => void;
  action: BuySellAction;
  onActionChange?: (value: BuySellAction) => void;
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
      {onPercentChange && (
        <NumberInput
          className="w-30 mx-2"
          min={0}
          max={action === BuySellAction.Sell ? 100 : undefined}
          defaultValue={10}
          stepper={5}
          suffix="%"
          value={percent}
          onValueChange={(val) => {
            if (action === BuySellAction.Sell && val && val > 100) {
              onPercentChange(100);
            } else {
              onPercentChange(val);
            }
          }}
          decimalScale={0}
        />
      )}
      {!onPercentChange && <div className="pr-1">X%</div>}
      <div>{t('flows.nodes.of_owned')}</div>
      {!onPercentChange && <div className="px-1"></div>}
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
    </ActionNodeUI>
  );
}
