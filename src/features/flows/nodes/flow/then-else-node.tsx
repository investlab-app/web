import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { CustomHandle } from '../../components/validated-handle';
import type { ReactNode } from 'react';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';

export type ThenElseNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.ThenElse
>;

export const ThenElseNode = (props: NodeProps<ThenElseNode>) => {
  return <ThenElseNodeUI id={props.id} />;
};

interface ThenElseNodeUIProps {
  id: string;
  children?: ReactNode;
  preview?: boolean;
}

export function ThenElseNodeUI({ id, preview }: ThenElseNodeUIProps) {
  return (
    <NodeUI preview={preview} nodeId={id} className={`bg-[var(--background)]`}>
      <div>Then</div>
      <div>Else</div>

      <CustomHandle
        nodeId={id}
        type="source"
        position={Position.Right}
        id="top-right"
        style={{ top: '30%' }}
      />
      <CustomHandle
        nodeId={id}
        type="source"
        position={Position.Right}
        id="bottom-right"
        style={{ top: '70%' }}
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
