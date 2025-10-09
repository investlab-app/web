import { RuleNodeUI } from '../rule-node-ui';

import type { ReactNode } from 'react';

interface TriggerNodeUIProps {
  children?: ReactNode;
  id: string;
  connectionsLen?: number;
}

export function TriggerNodeUI({
  children,
  id,
  connectionsLen,
}: TriggerNodeUIProps) {
  return (
    <RuleNodeUI
      id={id}
      className="bg-[var(--node-trigger)]"
      connectionsLen={connectionsLen}
    >
      {children}
    </RuleNodeUI>
  );
}
