import type { ReactNode } from 'react';

export interface CustomNodeProps {
  nodeId: string;
  children?: ReactNode;
  preview?: boolean;
}
