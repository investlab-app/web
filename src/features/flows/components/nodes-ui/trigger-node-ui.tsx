
import { RuleNodeUI } from './rule-node-ui';

import type { ReactNode } from 'react';


interface TriggerNodeUIProps {
  children?: ReactNode;
  id: string;
}

export function TriggerNodeUI({ children,  id }: TriggerNodeUIProps) {
return (
  <RuleNodeUI id={id} className='bg-blue-200'>
      {children}
  </RuleNodeUI>
)
;}