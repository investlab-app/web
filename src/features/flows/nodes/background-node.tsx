import type { Node, NodeProps } from '@xyflow/react';

export type BackgroundNode = Node<
  {
    colorClass: string;
  },
  'bg'
>;

export const BackgroundNode = (props: NodeProps<BackgroundNode>) => {
  return (
    <div
      className={`w-[1000px] h-[1000px] pointer-events-none select-none ${props.data.colorClass}`}
    >
      {' '}
      addd{' '}
    </div>
  );
};
