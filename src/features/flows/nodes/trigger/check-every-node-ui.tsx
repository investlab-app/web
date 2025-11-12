import { useTranslation } from 'react-i18next';

import { PredefinedOptionsSelect } from '../../components/predefined-options-select';
import { TIME_UNIT_OPTIONS } from '../../constants/node-options';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import { TriggerNodeUI } from './trigger-node-ui';
import type { TimeUnit } from '../../types/input-options-types';
import type { CustomNodeProps } from '../../types/node-props';

import { NumberInput } from '@/features/shared/components/ui/number-input';

interface CheckEveryNodeUIProps {
  interval?: number;
  unit?: TimeUnit;
  onIntervalChange?: (value: number | undefined) => void;
  onUnitChange?: (value: TimeUnit) => void;
}

export function CheckEveryNodeUI({
  interval,
  unit,
  onIntervalChange,
  onUnitChange,
  nodeId,
  preview,
}: CheckEveryNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <TriggerNodeUI nodeId={nodeId} preview={preview}>
      {!preview ? (
        <div>{t('flows.nodes.check_every')}</div>
      ) : (
        <div>{t('flows.placeholders.check_periodically')}</div>
      )}

      {onIntervalChange && (
        <NumberInput
          className="w-22 mx-2"
          min={1}
          max={getMaxValue(unit!)}
          defaultValue={1}
          stepper={1}
          value={interval}
          onValueChange={(val) => {
            const maxValue = getMaxValue(unit!);
            if (val && val > maxValue) {
              onIntervalChange(maxValue);
            } else {
              onIntervalChange(val);
            }
          }}
          decimalScale={0}
        />
      )}
      {onUnitChange && (
        <PredefinedOptionsSelect
          value={unit}
          onChange={onUnitChange}
          options={TIME_UNIT_OPTIONS}
          className="px-2 py-1 border rounded"
        />
      )}
    </TriggerNodeUI>
  );
}
