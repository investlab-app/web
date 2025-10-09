import { TriggerNodeUI } from './trigger-node-ui';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface EventWithinNodeUIProps {
  id: string;
  value: number;
  onValueChange?: (value: number | undefined) => void;
}

export function EventWithinNodeUI({
  id,
  value,
  onValueChange,
}: EventWithinNodeUIProps) {
  return (
    <TriggerNodeUI id={id}>
      <div>Happens in the past</div>
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
      {!onValueChange && <div className="px-1" />}
      <div>days</div>
    </TriggerNodeUI>
  );
}
