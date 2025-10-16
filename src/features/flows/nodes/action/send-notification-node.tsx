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

export const SendNotificationNode = (props: NodeProps<SendNotificationNode>) => {
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
  return (
    <ActionNodeUI preview={preview} nodeId={nodeId}>
      <div className="text-sm px-1">send</div>
      {onTypeChange && (
        <select
          className="px-2 py-1 border rounded text-xs"
          value={type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onTypeChange(e.target.value as 'email' | 'push')
          }
        >
          <option value="email">email</option>
          <option value="push">push</option>
        </select>
      )}
      {!onTypeChange && <div className="px-1">email/push</div>}
      <div className="text-sm">notification</div>
    </ActionNodeUI>
  );
}