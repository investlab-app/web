import { useTranslation } from 'react-i18next';
import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { ValidatedHandle } from '../../components/validated-handle';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface OccurredXTimesNodeUIProps {
  times?: number;
  interval?: number;
  period?: number;
  timeUnit?: 'hour' | 'day' | 'week' | 'month';
  intervalUnit?: 'hour' | 'day';
  onTimesChange?: (value: number | undefined) => void;
  onIntervalChange?: (value: number | undefined) => void;
  onPeriodChange?: (value: number | undefined) => void;
  onTimeUnitChange?: (value: 'hour' | 'day' | 'week' | 'month') => void;
  onIntervalUnitChange?: (value: 'hour' | 'day') => void;
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
        <select
          className="px-2 py-1 border rounded"
          value={timeUnit}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onTimeUnitChange(
              e.target.value as 'hour' | 'day' | 'week' | 'month'
            )
          }
        >
          <option value="hour">{t('flows.nodes.hour')}</option>
          <option value="day">{t('flows.nodes.day')}</option>
          <option value="week">{t('flows.nodes.week')}</option>
          <option value="month">{t('flows.nodes.month')}</option>
        </select>
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
        <select
          className="px-2 py-1 ml-2 border rounded"
          value={intervalUnit}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onIntervalUnitChange(e.target.value as 'hour' | 'day')
          }
        >
          <option value="hour">{t('flows.nodes.hour')}</option>
          <option value="day">{t('flows.nodes.day')}</option>
        </select>
      )}

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
    </NodeUI>
  );
}
