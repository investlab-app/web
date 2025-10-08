import type { Edge, Node } from '@xyflow/react';

export interface CommandNodeEvaluator {
  evaluate: (
    node: Node,
    allNodes: Array<Node>,
    allEdges: Array<Edge>,
    evaluators: Record<string, CommandNodeEvaluator>
  ) => Record<string, unknown>;
}
