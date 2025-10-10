import { TriggerNodeUI } from '../trigger/trigger-node-ui';

interface HappensBetweenNodeUIProps {
  startDate: Date;
  endDate: Date;
  onStartChange?: (value: Date | undefined) => void;
  onEndChange?: (value: Date | undefined) => void;
}

export function HappensBetweenNodeUI({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: HappensBetweenNodeUIProps) {
  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onStartChange?.(val ? new Date(val) : undefined);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onEndChange?.(val ? new Date(val) : undefined);
  };

  return (
    <TriggerNodeUI>
      <div className="text-sm px-1">Happens between</div>
      {onStartChange && (
        <input
          type="date"
          value={formatDate(startDate)}
          onChange={handleStartChange}
          className="border p-1 rounded mr-2"
        />
      )}
      {onEndChange && <div className="inline-block text-sm mx-2">and</div>}
      {onEndChange && (
        <input
          type="date"
          value={formatDate(endDate)}
          onChange={handleEndChange}
          className="border p-1 rounded"
        />
      )}
    </TriggerNodeUI>
  );
}
