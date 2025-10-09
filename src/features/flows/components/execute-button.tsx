import { Button } from '@/features/shared/components/ui/button';

interface ExecuteButtonProps {
  onExecute: () => void;
}

export function ExecuteButton({ onExecute }: ExecuteButtonProps) {
  return (
    <Button
      onClick={onExecute}
      className="m-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Execute Flow
    </Button>
  );
}
