import { useTranslation } from 'react-i18next';

import { EnumSelect } from '../../components/enum-select';
import {
  TIME_UNIT_OPTIONS,
  TREND_DIRECTION_OPTIONS,
} from '../../constants/node-options';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import { PredicateNodeUI } from './predicate-node-ui';
import type { CustomNodeProps } from '../../types/node-props';
import type { TimeUnit, TrendDirection } from '../../types/node-enums';

import { NumberInput } from '@/features/shared/components/ui/number-input';

interface HasRisenFallenNodeUIProps {
  direction?: TrendDirection;
  value?: number;
  period?: number;
  unit?: TimeUnit;
  onDirectionChange?: (value: TrendDirection) => void;
  onValueChange?: (value: number | undefined) => void;
  onPeriodChange?: (value: number | undefined) => void;
  onUnitChange?: (value: TimeUnit) => void;
}

export function HasRisenFallenNodeUI({
  direction,
  value,
  period,
  unit,
  onDirectionChange,
  onValueChange,
  onPeriodChange,
  onUnitChange,
  nodeId,
  preview,
}: HasRisenFallenNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <PredicateNodeUI
      nodeId={nodeId}
      preview={preview}
        comparatorComponent={<div>
        {t('flows.nodes.by')}
      </div>}
      onValueChange={onValueChange}
      value={value}
    >
      {!preview && (
        <div>
          {t('flows.nodes.value')} {t('flows.nodes.has')}
        </div>
      )}

      {onDirectionChange ? (
        <EnumSelect
          value={direction}
          onChange={onDirectionChange}
          options={TREND_DIRECTION_OPTIONS}
          className="px-2 py-1 mx-2 border rounded"
        />
      ) : (
        <div>
          {t('flows.nodes.has')} {t('flows.placeholders.risen_fallen')}{' '}
          {t('flows.nodes.by')}
        </div>
      )}

      {!preview && <div>{t('flows.nodes.over_duration')}</div>}

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
    </PredicateNodeUI>
  );
}
