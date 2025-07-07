import type { ReactNode } from 'react';
import { CardContent } from '@/features/shared/components/ui/card';

interface ContentProps {
  children: ReactNode;
}

export const Content = ({ children }: ContentProps) => (
  <CardContent>{children}</CardContent>
);
