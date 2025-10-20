import { Position } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { NodeUI } from '../node-ui';
import { CustomHandle } from '../../components/validated-handle';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';
import type { CustomNodeProps } from '../../types/node-props';

export type FlowNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.IfThenElse
>;

export const FlowNode = (props: NodeProps<FlowNode>) => {
  return <FlowNodeUI nodeId={props.id} />;
};

export function FlowNodeUI({ nodeId, preview }: CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <NodeUI
      preview={preview}
      nodeId={nodeId}
      className={`bg-[var(--background)]`}
    >
      <div className="flex flex-col gap-2 text-center">
        <div>{t('flows.nodes.if').toUpperCase()}</div>
        <div>{t('flows.nodes.then').toUpperCase()}</div>
        <div>{t('flows.nodes.else').toUpperCase()}</div>
      </div>

      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id={0}
        style={{ top: '20%' }}
        overrideAllowedConnections={1}
      />
      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id={1}
        style={{ top: '50%' }}
      />
      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id={2}
        style={{ top: '80%' }}
      />
      <CustomHandle
        nodeId={nodeId}
        type="target"
        position={Position.Left}
        id={0}
        style={{ top: '20%' }}
      />
    </NodeUI>
  );
}
