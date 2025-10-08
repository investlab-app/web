import type { ReactNode } from 'react';

interface CommandNodeUIProps {
  children?: ReactNode;
  className?: string;
}

export function CommandNodeUI({ children, className }: CommandNodeUIProps) {
  return (
    <div
      className={`p-2 border border-[#555] rounded min-w-[100px] flex items-center justify-center ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
