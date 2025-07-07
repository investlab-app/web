import type { ReactNode } from 'react';
import { Card } from '@/features/shared/components/ui/card';

interface RootProps {
  children: ReactNode;
}

export const Root = ({ children }: RootProps) => (
  <Card className="flex flex-col gap-6">{children}</Card>
);
