import { TriggerNodeUI } from './trigger-node-ui';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface EventWithinNodeUIProps {
  id: string;
  value: number;
  onValueChange?: (value: number | undefined) => void;
  connectionsLen?: number;
}

export function EventWithinNodeUI({
  id,
  value,
  onValueChange,
  connectionsLen,
}: EventWithinNodeUIProps) {
  return (
    <TriggerNodeUI id={id} connectionsLen={connectionsLen}>
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
