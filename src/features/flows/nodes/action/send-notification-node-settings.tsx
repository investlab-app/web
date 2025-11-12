import { useNodeData } from '../../hooks/use-node-data';
import { NotificationType } from '../../types/input-options-types';
import { ActionNodeSettings } from './action-node-settings';
import { SendNotificationNodeUI } from './send-notification-node-ui';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';

export class SendNotificationNodeSettings extends ActionNodeSettings {
  type: NotificationType;
  message: string;

  constructor() {
    super();
    this.type = NotificationType.Push;
    this.message = '';
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      super.isValid(inConnections, outConnections) &&
      this.message.trim().length > 0
    );
  }

  getUpdatedType(type: NotificationType): SendNotificationNodeSettings {
    this.type = type;
    return this;
  }
  getUpdatedMessage(message: string): SendNotificationNodeSettings {
    this.message = message;
    return this;
  }
}

export type SendNotificationNode = Node<
  {
    settings: SendNotificationNodeSettings;
  },
  typeof CustomNodeTypes.SendNotification
>;

export const SendNotificationNode = (
  props: NodeProps<SendNotificationNode>
) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <SendNotificationNodeUI
      nodeId={props.id}
      type={props.data.settings.type}
      onTypeChange={(val: NotificationType) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedType(val),
        });
      }}
      message={props.data.settings.message}
      onMessageChange={(val: string) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedMessage(val),
        });
      }}
    />
  );
};
