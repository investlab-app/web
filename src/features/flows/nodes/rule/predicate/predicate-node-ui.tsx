import { RuleNodeUI } from '../rule-node-ui';

import type { ReactNode } from 'react';

interface PredicateNodeUIProps {
  children?: ReactNode;
  id: string;
}

export function PredicateNodeUI({ children, id }: PredicateNodeUIProps) {
  return (
    <RuleNodeUI id={id} className="bg-[var(--node-predicate)]">
      {children}
    </RuleNodeUI>
  );
}
