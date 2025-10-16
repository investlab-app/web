import { Position } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { NodeUI } from '../node-ui';
import { CustomHandle } from '../../components/validated-handle';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';
import type { CustomNodeProps } from '../../types/node-props';

export type IfNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.If
>;

export const IfNode = (props: NodeProps<IfNode>) => {
  return <IfNodeUI nodeId={props.id} />;
};

export function IfNodeUI({ nodeId, preview }: CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <NodeUI
      preview={preview}
      nodeId={nodeId}
      className={`bg-[var(--background)]`}
    >
      {t('flows.nodes.if').toUpperCase()}
      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id="right"
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
