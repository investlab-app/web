import { useTranslation } from 'react-i18next';
import { TriggerNodeUI } from './trigger-node-ui';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface PriceChangesNodeUIProps {
  value?: string;
  direction?: 'over' | 'under';
  price?: number;
  onValueChange?: (value: string) => void;
  onDirectionChange?: (direction: 'over' | 'under') => void;
  onPriceChange?: (price: number | undefined) => void;
}

export function PriceChangesNodeUI({
  value,
  direction,
  price,
  onValueChange,
  onDirectionChange,
  onPriceChange,
  nodeId,
  preview,
}: PriceChangesNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <TriggerNodeUI nodeId={nodeId} preview={preview}>
      <div>{t('flows.nodes.price')}</div>
      {onValueChange && (
        <input
          className="mx-2 px-2 py-1 border rounded"
          type="text"
          placeholder="AAPL"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onValueChange(e.target.value)
          }
        />
      )}
      {onDirectionChange ? (
        <select
          className="px-2 py-1 border rounded"
          value={direction}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onDirectionChange(e.target.value as 'over' | 'under')
          }
        >
          <option value="over">{t('flows.nodes.over')}</option>
          <option value="under">{t('flows.nodes.under')}</option>
        </select>
      ) : (
        <div className="pl-1">{t('flows.placeholders.reaches_threshold')}</div>
      )}
      {onValueChange && (
        <NumberInput
          className="w-30 ml-2"
          min={1}
          stepper={25}
          defaultValue={100.0}
          prefix="$"
          value={price}
          onValueChange={onPriceChange}
          fixedDecimalScale={true}
          decimalScale={2}
        />
      )}
    </TriggerNodeUI>
  );
}
