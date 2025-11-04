import { useNodeData } from '../../hooks/use-node-data';
import { NotificationType } from '../../types/node-enums';
import { ActionNodeSettings } from './action-node-settings';
import { SendNotificationNodeUI } from './send-notification-node-ui';
import type { CustomNodeTypes } from '../../types/node-types-2';
import type { Node, NodeProps } from '@xyflow/react';

export class SendNotificationNodeSettings extends ActionNodeSettings {
  type: NotificationType;

  constructor() {
    super();
    this.type = NotificationType.Push;
  }

  getUpdated(type: NotificationType): SendNotificationNodeSettings {
    this.type = type;
    return this;
  }
}

export type SendNotificationNode = Node<
  {
    settings: SendNotificationNodeSettings;
  },
  CustomNodeTypes.SendNotification
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
          settings: props.data.settings.getUpdated(val),
        });
      }}
    />
  );
};
