import { Position } from '@xyflow/react';
import { useTranslation } from 'react-i18next';

import { EnumSelect } from '../../components/enum-select';
import { ValidatedHandle } from '../../components/validated-handle';
import {
  SHORT_TIME_UNIT_OPTIONS,
  TIME_UNIT_OPTIONS,
} from '../../constants/node-options';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import { NodeUI } from '../node-ui';
import type { CustomNodeProps } from '../../types/node-props';
import type { ShortTimeUnit, TimeUnit } from '../../types/node-enums';

import { NumberInput } from '@/features/shared/components/ui/number-input';

interface OccurredXTimesNodeUIProps {
  times?: number;
  interval?: number;
  period?: number;
  timeUnit?: TimeUnit;
  intervalUnit?: ShortTimeUnit;
  onTimesChange?: (value: number | undefined) => void;
  onIntervalChange?: (value: number | undefined) => void;
  onPeriodChange?: (value: number | undefined) => void;
  onTimeUnitChange?: (value: TimeUnit) => void;
  onIntervalUnitChange?: (value: ShortTimeUnit) => void;
}

export function OccurredXTimesNodeUI({
  times,
  interval,
  period,
  intervalUnit,
  timeUnit,
  onTimesChange,
  onIntervalChange,
  onPeriodChange,
  onIntervalUnitChange,
  onTimeUnitChange,
  nodeId,
  preview,
}: OccurredXTimesNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <NodeUI nodeId={nodeId} preview={preview}>
      <div>{t('flows.nodes.occured')}</div>

      {onTimesChange ? (
        <NumberInput
          className="w-25 mx-2"
          min={0}
          defaultValue={1}
          stepper={1}
          value={times}
          onValueChange={(val) => {
            onTimesChange(val);
          }}
          decimalScale={0}
        />
      ) : (
        <div className="mx-1">X</div>
      )}
      <div>
        {t('flows.nodes.times')} {t('flows.nodes.over_duration')}
      </div>

      {onPeriodChange && (
        <NumberInput
          className="w-25 mx-2"
          min={1}
          max={getMaxValue(timeUnit!)}
          defaultValue={1}
          stepper={1}
          value={period}
          onValueChange={(val) => {
            const maxValue = getMaxValue(timeUnit!);
            if (val && val > maxValue) {
              onPeriodChange(maxValue);
            } else {
              onPeriodChange(val);
            }
          }}
          decimalScale={0}
        />
      )}
      {onTimeUnitChange && (
        <EnumSelect
          value={timeUnit}
          onChange={onTimeUnitChange}
          options={TIME_UNIT_OPTIONS}
          className="px-2 py-1 border rounded"
        />
      )}
      {!preview && <div className="mx-2">{t('flows.nodes.with_events')}</div>}
      {onIntervalChange && (
        <NumberInput
          className="w-25"
          min={1}
          max={getMaxValue(intervalUnit!)}
          defaultValue={1}
          stepper={1}
          value={interval}
          onValueChange={(val) => {
            const maxValue = getMaxValue(intervalUnit!);
            if (val && val > maxValue) {
              onIntervalChange(maxValue);
            } else {
              onIntervalChange(val);
            }
          }}
          decimalScale={0}
        />
      )}
      {onIntervalUnitChange && (
        <EnumSelect
          value={intervalUnit}
          onChange={onIntervalUnitChange}
          options={SHORT_TIME_UNIT_OPTIONS}
          className="px-2 py-1 ml-2 border rounded"
        />
      )}
{!preview &&(
  <>
      <ValidatedHandle
        nodeId={nodeId}
        type="target"
        position={Position.Left}
        id="out"
      />
      <ValidatedHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id="in"
      />
        </>
      )}
    </NodeUI>
  );
}
