import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { CustomHandle } from '../../components/validated-handle';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';
import type { CustomNodeProps } from '../../types/node-props';

export type ThenElseNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.ThenElse
>;

export const ThenElseNode = (props: NodeProps<ThenElseNode>) => {
  return <ThenElseNodeUI nodeId={props.id} />;
};

export function ThenElseNodeUI({ nodeId, preview }: CustomNodeProps) {
  return (
    <NodeUI
      preview={preview}
      nodeId={nodeId}
      className={`bg-[var(--background)]`}
    >
      <div className="flex flex-col gap-2 text-center">
        <div>Then</div>
        <div>Else</div>
      </div>

      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id="top-right"
        style={{ top: '30%' }}
      />
      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id="bottom-right"
        style={{ top: '70%' }}
      />
      <CustomHandle
        nodeId={nodeId}
        type="target"
        position={Position.Left}
        id="left"
      />
    </NodeUI>
  );
}
