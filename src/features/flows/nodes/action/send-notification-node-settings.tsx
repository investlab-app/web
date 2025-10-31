import { useNodeData } from '../../hooks/use-node-data';
import { SendNotificationNodeUI } from './send-notification-node-ui';
import { ActionNodeSettings } from './action-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class SendNotificationNodeSettings extends ActionNodeSettings {
  type: 'email' | 'push';

  constructor() {
    super();
    this.type = 'push';
  }

  getUpdated(type: 'email' | 'push'): SendNotificationNodeSettings {
    this.type = type;
    return this;
  }
}

export type SendNotificationNode = Node<
  {
    settings: SendNotificationNodeSettings
  },
  CustomNodeTypes.SendNotification
>;

export const SendNotificationNode = (
  props: NodeProps<SendNotificationNode>
) => {
  const { updateNodeData } = useNodeData(
    props.id
  );

  return (
    <SendNotificationNodeUI
      nodeId={props.id}
      type={props.data.settings.type}
      onTypeChange={(val) => {
       updateNodeData({
          settings: props.data.settings.getUpdated(val),
        });
      }}
    />
  );
};