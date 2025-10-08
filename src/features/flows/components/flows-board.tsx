import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useCallback } from 'react';
import { DnDProvider } from '../utils/dnd-context';
import { RuleNode } from '../nodes/rule/rule-node';
import { evaluators } from '../utils/evaluators';
import { ConnectorNode } from '../nodes/connector/connector-node';
import { PriceChangesNode } from '../nodes/rule/trigger/price-changes-node';
import { DnDSidebar } from './dnd-sidebar';
import { ExecuteButton } from './execute-button';
import type { Connection, NodeTypes } from '@xyflow/react';
import { useTheme } from '@/features/shared/components/theme-provider';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { children: <div>Node 1</div> },
    type: 'ruleNode',
  },
  {
    id: 'n23',
    position: { x: 200, y: 150 },
    data: { isAnd: false },
    type: 'connectorNode',
  },
  {
    id: 'n20',
    position: { x: 200, y: 50 },
    data: { value: 'AAPL', direction: 'rises' },
    type: 'priceChangesNode',
  },
];

const nodeTypes: NodeTypes = {
  ruleNode: RuleNode,
  connectorNode: ConnectorNode,
  priceChangesNode: PriceChangesNode
};

export function FlowsBoard() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges]
  );

  const { appTheme: theme } = useTheme();

  return (
    <ReactFlowProvider>
    <DnDProvider>
    <div className="flex w-full h-[500px]">
      <div className="flex-1">
        <ReactFlow
          colorMode={theme}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          panOnDrag={false}
          zoomOnPinch={false}
          autoPanOnConnect={false}
          autoPanOnNodeDrag={false}
          zoomOnScroll={false}
          isValidConnection={() => true}
          fitView
        >
          <Background />
        </ReactFlow>
      </div>
      <div className="w-64 bg-gray-100 p-4">
        <DnDSidebar />
      </div>
      <ExecuteButton evaluators={evaluators} />
    </div>
    </DnDProvider>
    </ReactFlowProvider>
  );
}
