// import { useEdges, useNodes } from '@xyflow/react';
// import { useCallback } from 'react';
// import type { CommandNodeEvaluator } from '../types/command-node-evaluator';
import { Button } from '@/features/shared/components/ui/button';

interface ExecuteButtonProps {
  onExecute: () => void;
}

export function ExecuteButton({ onExecute }: ExecuteButtonProps) {
  //   const nodes = useNodes();
  //   const edges = useEdges();

  //   const execute = useCallback(() => {
  //     console.log('Evaluating graph with nodes:', nodes);

  //     const result = nodes.map((node) => {
  //       console.log('Evaluating node:', node);
  //       const evaluator = evaluators[node.type!];
  //       return evaluator.evaluate(node, nodes, edges, evaluators);
  //     });
  //     console.log('evaluation result:', result);
  //   }, [nodes, edges, evaluators]);

  return (
    <Button
      onClick={onExecute}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Execute Flow
    </Button>
  );
}
