import { useTranslation } from 'react-i18next';
import { BuySellSelect } from '../../components/buy-sell-select';
import { ActionNodeUI } from './action-node-ui';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface BuySellPriceNodeUIProps {
  instrument: string;
  onInstrumentChange?: (value: string | undefined) => void;
  price?: number;
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
          defaultValue={1}
          prefix="$"
          stepper={0.5}
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
