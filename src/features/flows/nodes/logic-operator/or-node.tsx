import { useTranslation } from 'react-i18next';
import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { CustomHandle } from '../../components/validated-handle';
import type { CustomNodeProps } from '../../types/node-props';

export function OrNodeUI({ nodeId, preview }: CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <NodeUI
      preview={preview}
      nodeId={nodeId}
      className={`bg-[var(--background)]`}
    >
      {t('flows.nodes.or').toUpperCase()}

      <CustomHandle
        nodeId={nodeId}
        type="target"
        position={Position.Left}
        id={0}
      />
      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id={0}
        style={{ top: '30%' }}
      />
      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        style={{ top: '70%' }}
        id={1}
      />
    </NodeUI>
  );
}
