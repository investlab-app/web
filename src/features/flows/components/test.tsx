import {
  Background,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useCallback } from 'react';
import { ConnectorNode } from './connector-node';
import { RuleNode } from './rule-node';
import type { Connection, Edge, NodeTypes } from '@xyflow/react';
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
    id: 'n10',
    position: { x: 330, y: 0 },
    data: { label: 'Node 10' },
    type: 'input',
  },
  {
    id: 'n2',
    position: { x: 100, y: 100 },
    data: { children: <div>Node 55</div> },
    type: 'ruleNode',
  },
  {
    id: 'n3',
    position: { x: 100, y: 150 },
    data: { isAnd: true },
    type: 'connectorNode',
  },
  {
    id: 'n23',
    position: { x: 200, y: 150 },
    data: { isAnd: false },
    type: 'connectorNode',
  },
];
const initialEdges: Array<Edge> = [];

const nodeTypes: NodeTypes = {
  ruleNode: RuleNode,
  connectorNode: ConnectorNode,
};

export function Test() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges]
  );
  const { appTheme: theme } = useTheme();
  return (
    <div className="w-full h-[500px]">
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
  );
}
