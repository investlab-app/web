import type { ReactNode } from 'react';

interface NodeUIProps {
  children?: ReactNode;
  className?: string;
}

export function NodeUI({ children, className }: NodeUIProps) {
  return (
    <div
      className={`p-2 border border-[#555] rounded min-w-[100px] flex items-center justify-center ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
