import { useTranslation } from 'react-i18next';

import { EnumSelect } from '../../components/enum-select';
import { PRICE_DIRECTION_OPTIONS } from '../../constants/node-options';
import { TriggerNodeUI } from './trigger-node-ui';
import type { PriceDirection } from '../../types/node-enums';
import type { CustomNodeProps } from '../../types/node-props';

import { NumberInput } from '@/features/shared/components/ui/number-input';

interface PriceChangesNodeUIProps {
  value?: string;
  direction?: PriceDirection;
  price?: number;
  onValueChange?: (value: string) => void;
  onDirectionChange?: (direction: PriceDirection) => void;
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
          onChange={(e) => onValueChange(e.target.value)}
        />
      )}
      {onDirectionChange ? (
        <EnumSelect
          value={direction}
          onChange={onDirectionChange}
          options={PRICE_DIRECTION_OPTIONS}
          className="px-2 py-1 border rounded"
        />
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
