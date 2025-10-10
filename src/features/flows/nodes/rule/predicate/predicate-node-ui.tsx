import { RuleNodeUI } from '../rule-node-ui';

import type { ReactNode } from 'react';

interface PredicateNodeUIProps {
  children?: ReactNode;
  id: string;
  connectionsLen?: number;
}

export function PredicateNodeUI({ children, id, connectionsLen }: PredicateNodeUIProps) {
  return (
    <RuleNodeUI id={id} className="bg-[var(--node-predicate)]" connectionsLen={connectionsLen}>
      {children}
    </RuleNodeUI>
  );
}
