import { memo } from 'react';
import { RuleNodeUI } from '../../components/nodes-ui/rule-node-ui';
import type { ReactNode } from 'react';
import type { Node, NodeProps } from '@xyflow/react';
import type { CommandNodeEvaluator } from '../../types/command-node-evaluator';

export type RuleNode = Node<
  {
    children?: Array<ReactNode>;
  },
  'ruleNode'
>;

export const RuleNode = memo((props: NodeProps<RuleNode>) => {
  return <RuleNodeUI id={props.id} children={props.data.children} />;
});

export const RuleNodeEvaluator: CommandNodeEvaluator = {
  evaluate() {
    return { a: 'b' };
  },
};
