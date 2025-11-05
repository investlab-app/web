import { useTranslation } from 'react-i18next';
import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { ValidatedHandle } from '../../components/validated-handle';
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
{!preview &&(
  <>
      <ValidatedHandle
        nodeId={nodeId}
        type="target"
        position={Position.Left}
        id="out"
      />
      <ValidatedHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id="inA"
        style={{ top: '30%' }}
      />
      <ValidatedHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        style={{ top: '70%' }}
        id="inB"
      />
        </>
      )}
    </NodeUI>
  );
}
