import { ConnectorNodeEvaluator } from '../nodes/connector/connector-node';
import { RuleNodeEvaluator } from '../nodes/rule/rule-node';
import { PriceChangeNodeEvaluator } from '../nodes/rule/trigger/price-changes-node';
import type { CommandNodeEvaluator } from '../types/command-node-evaluator';

export const evaluators: Record<string, CommandNodeEvaluator> = {
  connectorNode: ConnectorNodeEvaluator,
  ruleNode: RuleNodeEvaluator,
  priceChangesNode: PriceChangeNodeEvaluator
};
