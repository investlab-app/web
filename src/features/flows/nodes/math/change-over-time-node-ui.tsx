import { Position } from '@xyflow/react';
import { useTranslation } from 'react-i18next';

import { EnumSelect } from '../../components/enum-select';
import { ValidatedHandle } from '../../components/validated-handle';
import { TIME_UNIT_OPTIONS } from '../../constants/node-options';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import { NodeUI } from '../node-ui';
import type { CustomNodeProps } from '../../types/node-props';
import type { TimeUnit } from '../../types/node-enums';

import { NumberInput } from '@/features/shared/components/ui/number-input';

interface ChangeOverTimeNodeUIProps {
  interval?: number;
  unit?: TimeUnit;
  onIntervalChange?: (value: number | undefined) => void;
  onUnitChange?: (value: TimeUnit) => void;
}

export function ChangeOverTimeNodeUI({
  nodeId,
  preview,
  unit,
  interval,
  onUnitChange,
  onIntervalChange,
}: ChangeOverTimeNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <NodeUI
      preview={preview}
      nodeId={nodeId}
      className={`bg-[var(--node-math)]`}
    >
      <div>
        {t('flows.nodes.change_of_value')} {t('flows.nodes.over_duration')}{' '}
      </div>

      {preview && <div className="ml-1">{t('flows.placeholders.time')}</div>}

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
        <EnumSelect
          value={unit}
          onChange={onUnitChange}
          options={TIME_UNIT_OPTIONS}
          className="px-2 py-1 border rounded"
        />
      )}

      <ValidatedHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id="in"
      />
      <ValidatedHandle
        nodeId={nodeId}
        type="target"
        position={Position.Left}
        id="out"
      />
    </NodeUI>
  );
}
