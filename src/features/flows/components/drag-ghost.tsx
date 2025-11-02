import { useDnDPosition } from '../hooks/use-dnd';

interface DragGhostProps {
  type: string | null;
}

export function DragGhost({ type }: DragGhostProps) {
  const { position } = useDnDPosition();

  if (!position) return null;

  console.log(position);

  return (
    <div
      className="
        pointer-events-none
        absolute
        z-50
        px-3 py-2
        min-w-[100px]
        rounded
        border border-gray-500
        bg-white
        text-sm text-gray-800
        shadow-md
        flex items-center justify-center
        transform
        transition-transform duration-100
      "
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {type && `${type.charAt(0).toUpperCase() + type.slice(1)}`}
    </div>
  );
}
