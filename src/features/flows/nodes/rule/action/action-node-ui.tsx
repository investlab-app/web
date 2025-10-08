import { RuleNodeUI } from '../rule-node-ui';

import type { ReactNode } from 'react';

interface ActionNodeUIProps {
  children?: ReactNode;
  id: string;
}

export function ActionNodeUI({ children, id }: ActionNodeUIProps) {
  return (
    <RuleNodeUI id={id} className="bg-[var(--node-action)]">
      {children}
    </RuleNodeUI>
  );
}
