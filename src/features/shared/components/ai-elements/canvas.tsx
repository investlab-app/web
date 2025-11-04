import { Background, ReactFlow } from '@xyflow/react';
import type { ReactFlowProps } from '@xyflow/react';
import type { ReactNode } from 'react';
import '@xyflow/react/dist/style.css';
// eslint-disable-next-line import/order
import { Controls } from './controls';

type CanvasProps = ReactFlowProps & {
  children?: ReactNode;
};

export const Canvas = ({ children, ...props }: CanvasProps) => (
  <ReactFlow
    deleteKeyCode={['Backspace', 'Delete']}
    fitView
    panOnDrag={false}
    panOnScroll
    selectionOnDrag={true}
    zoomOnDoubleClick={false}
    {...props}
  >
    <Background bgColor="var(--sidebar)" />
    <Controls />
    {children}
  </ReactFlow>
);
