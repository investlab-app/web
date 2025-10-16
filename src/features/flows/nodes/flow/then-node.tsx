import { Position } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { NodeUI } from '../node-ui';
import { CustomHandle } from '../../components/validated-handle';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';
import type { CustomNodeProps } from '../../types/node-props';

export type ThenNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.Then
>;

export const ThenNode = (props: NodeProps<ThenNode>) => {
  return <ThenNodeUI nodeId={props.id} />;
};

export function ThenNodeUI({ nodeId, preview }: CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <NodeUI
      preview={preview}
      nodeId={nodeId}
      className={`bg-[var(--background)]`}
    >
      <div>{t('flows.nodes.then').toUpperCase()}</div>

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
