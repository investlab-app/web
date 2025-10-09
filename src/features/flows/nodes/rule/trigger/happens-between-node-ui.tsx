import { TriggerNodeUI } from './trigger-node-ui';

interface HappensBetweenNodeUIProps {
  id: string;
  startDate: Date;
  endDate: Date;
  onStartChange?: (value: Date | undefined) => void;
  onEndChange?: (value: Date | undefined) => void;
}

export function HappensBetweenNodeUI({
  id,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: HappensBetweenNodeUIProps) {
  // Helper to convert Date to yyyy-MM-dd string for input value
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
    <TriggerNodeUI id={id}>
      <div>Happens between</div>
      {onStartChange && (
        <input
          type="date"
          value={formatDate(startDate)}
          onChange={handleStartChange}
          className="border p-1 rounded mr-2"
        />
      )}
      {onEndChange && <div className="inline-block mx-2">and</div>}
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
