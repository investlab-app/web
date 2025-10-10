
import { TriggerNodeUI } from '../trigger/trigger-node-ui';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface EventWithinNodeUIProps {
  value: number;
  onValueChange?: (value: number | undefined) => void;
}

export function EventWithinNodeUI({
  value,
  onValueChange,
}: EventWithinNodeUIProps) {
  return (
    <TriggerNodeUI>
      <div className="text-sm px-1">Happens in the past</div>
      {onValueChange && (
        <NumberInput
          className="w-20 mx-2"
          min={1}
          defaultValue={1}
          value={value}
          onValueChange={onValueChange}
          decimalScale={0}
        />
      )}
      {!onValueChange && <div className="px-1">X</div>}
      <div className="text-sm">days</div>
    </TriggerNodeUI>
  );
}
