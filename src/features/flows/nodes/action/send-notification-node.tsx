import { useTranslation } from 'react-i18next';
import { useUpdateNodeInternals } from '@xyflow/react';
import { ActionNodeUI } from './action-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';

export type SendNotificationNode = Node<
  {
    type: 'email' | 'push';
  },
  CustomNodeTypes.SendNotification
>;

export const SendNotificationNode = (
  props: NodeProps<SendNotificationNode>
) => {
  const updateNodeInternals = useUpdateNodeInternals();

  return (
    <SendNotificationNodeUI
      nodeId={props.id}
      type={props.data.type}
      onTypeChange={(val) => {
        props.data.type = val;
        updateNodeInternals(props.id);
      }}
    />
  );
};

interface SendNotificationNodeUIProps {
  type: 'email' | 'push';
  onTypeChange?: (value: 'email' | 'push') => void;
}

export function SendNotificationNodeUI({
  type,
  onTypeChange,
  nodeId,
  preview,
}: SendNotificationNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <ActionNodeUI preview={preview} nodeId={nodeId}>
      <div>{t('flows.nodes.send_notification')}</div>
      {onTypeChange && (
        <select
          className="px-2 ml-2 py-1 border rounded"
          value={type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onTypeChange(e.target.value as 'email' | 'push')
          }
        >
          <option value="email">{t('flows.nodes.email')}</option>
          <option value="push">{t('flows.nodes.push')}</option>
        </select>
      )}
      {!onTypeChange && (
        <div className="px-1">{t('flows.placeholders.email_push')}</div>
      )}
    </ActionNodeUI>
  );
}
