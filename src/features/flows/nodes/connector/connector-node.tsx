import { memo } from 'react';
import { getIncomers} from '@xyflow/react';
import { ConnectorNodeUI } from '../../components/nodes-ui/connector-node-ui';
import type { CommandNodeEvaluator } from '../../types/command-node-evaluator';
import type {   Node, NodeProps } from '@xyflow/react';

export type ConnectorNode = Node<
  {
    isAnd: boolean;
  },
  'connectorNode'
>;

export const ConnectorNode = memo((props: NodeProps<ConnectorNode>) => {
 

  return (
    <ConnectorNodeUI id={props.id} isAnd={props.data.isAnd} />
  );
});


export const ConnectorNodeEvaluator: CommandNodeEvaluator = {
    evaluate(node, allNodes, allEdges, evaluators) {
      const incomers = getIncomers(node, allNodes, allEdges);
        const inputs = incomers.map((inNode) => {
      const evaluator = evaluators[inNode.type!];
      return evaluator.evaluate( inNode, allNodes, allEdges, evaluators );
    });

 if (node.data.isAnd) {
      return {
        type: 'AND',
        inputs,
      };
    } else {
      return {
        type: 'OR',
        inputs,
      };
    }

    }
}