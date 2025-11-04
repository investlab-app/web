import { useTranslation } from 'react-i18next';

import { BuySellSelect } from '../../components/buy-sell-select';
import { ActionNodeUI } from './action-node-ui';
import type { CustomNodeProps } from '../../types/node-props';
import type { BuySellAction } from '../../types/node-enums';
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
      <BuySellSelect action={action} onActionChange={onActionChange} />
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
