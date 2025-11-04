import { useTranslation } from 'react-i18next';

import { EnumSelect } from '../../components/enum-select';
import {
  POSITION_DIRECTION_OPTIONS,
  TIME_UNIT_OPTIONS,
} from '../../constants/node-options';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import { PredicateNodeUI } from './predicate-node-ui';
import type { CustomNodeProps } from '../../types/node-props';
import type { PositionDirection, TimeUnit } from '../../types/node-enums';

import { NumberInput } from '@/features/shared/components/ui/number-input';

interface StaysAboveBelowNodeUIProps {
  direction?: PositionDirection;
  threshold?: number;
  period?: number;
  unit?: TimeUnit;
  onDirectionChange?: (value: PositionDirection) => void;
  onThresholdChange?: (value: number | undefined) => void;
  onPeriodChange?: (value: number | undefined) => void;
  onUnitChange?: (value: TimeUnit) => void;
}

export function StaysAboveBelowNodeUI({
  direction,
  threshold,
  period,
  unit,
  onDirectionChange,
  onThresholdChange,
  onPeriodChange,
  onUnitChange,
  nodeId,
  preview,
}: StaysAboveBelowNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <PredicateNodeUI
      nodeId={nodeId}
      preview={preview}
      onValueChange={onThresholdChange}
      value={threshold}
    >
      {!preview && <div>{t('flows.nodes.for_duration')}</div>}

      {onPeriodChange && (
        <NumberInput
          className="w-20 mx-2"
          min={1}
          max={unit ? getMaxValue(unit) : 99}
          defaultValue={1}
          stepper={1}
          value={period}
          onValueChange={(val) => {
            const maxValue = unit ? getMaxValue(unit) : 99;
            if (val && val > maxValue) {
              onPeriodChange(maxValue);
            } else {
              onPeriodChange(val);
            }
          }}
          decimalScale={0}
        />
      )}

      {onUnitChange && (
        <EnumSelect
          value={unit}
          onChange={onUnitChange}
          options={TIME_UNIT_OPTIONS}
          className="px-2 py-1 border rounded"
        />
      )}

      {!preview ? (
        <div className="mx-2">
          {t('flows.nodes.value')} {t('flows.nodes.stays')}
        </div>
      ) : (
        <div>
          {t('flows.nodes.stays')}{' '}
          {t('flows.placeholders.above_below_threshold')}
        </div>
      )}

      {onDirectionChange && (
        <EnumSelect
          value={direction}
          onChange={onDirectionChange}
          options={POSITION_DIRECTION_OPTIONS}
          className="px-2 py-1 mx-1 border rounded"
        />
      )}
    </PredicateNodeUI>
  );
}
