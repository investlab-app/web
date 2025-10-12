import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { CustomHandle } from '../../components/validated-handle';
import type { ReactNode } from 'react';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';

export type IfNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.If
>;

export const IfNode = (props: NodeProps<IfNode>) => {
  return <IfNodeUI id={props.id} />;
};

interface IfNodeUIProps {
  id: string;
  children?: ReactNode;
  preview?: boolean;
}

export function IfNodeUI({ id, preview }: IfNodeUIProps) {
  return (
    <NodeUI preview={preview} nodeId={id} className={`bg-[var(--background)]`}>
      If
      <CustomHandle
        nodeId={id}
        type="source"
        position={Position.Right}
        id="right"
      />
      <CustomHandle
        nodeId={id}
        type="target"
        position={Position.Left}
        id="left"
      />
    </NodeUI>
  );
}
