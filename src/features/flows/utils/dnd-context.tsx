import { createContext, useState } from 'react';
import type { XYPosition } from '@xyflow/react';
import type { Dispatch, SetStateAction } from 'react';

export type OnDropAction = ({ position }: { position: XYPosition }) => void;

interface DnDContextType {
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  dropAction: OnDropAction | null;
  setDropAction: Dispatch<SetStateAction<OnDropAction | null>>;
}

export const DnDContext = createContext<DnDContextType | null>(null);

export function DnDProvider({ children }: { children: React.ReactNode }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dropAction, setDropAction] = useState<OnDropAction | null>(null);

  return (
    <DnDContext.Provider
      value={{
        isDragging,
        setIsDragging,
        dropAction,
        setDropAction: (action) => setDropAction(() => action),
      }}
    >
      {children}
    </DnDContext.Provider>
  );
}
