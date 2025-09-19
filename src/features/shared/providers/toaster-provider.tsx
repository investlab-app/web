import { useTheme } from '../components/theme-provider';
import { Toaster } from '../components/ui/sonner';
import type { ReactNode } from 'react';

export function ToasterProvider({ children }: { children: ReactNode }) {
  const { appTheme } = useTheme();
  return (
    <>
      {children}
      <Toaster theme={appTheme} />
    </>
  );
}
