import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { CustomHandle } from '../../components/validated-handle';
import type { ReactNode } from 'react';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';

export type ThenNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.Then
>;

export const ThenNode = (props: NodeProps<ThenNode>) => {
  return <ThenNodeUI id={props.id} />;
};

interface ThenNodeUIProps {
  id: string;
  children?: ReactNode;
  preview?: boolean;
}

export function ThenNodeUI({ id, preview }: ThenNodeUIProps) {
  return (
    <NodeUI preview={preview} nodeId={id} className={`bg-[var(--background)]`}>
      <div>Then</div>

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
