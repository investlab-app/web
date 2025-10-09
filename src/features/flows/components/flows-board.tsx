import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useCallback, useState } from 'react';
import { DnDProvider } from '../utils/dnd-context';
import { ConnectorNode } from '../nodes/connector/connector-node';
import { PriceChangesNode } from '../nodes/rule/trigger/price-changes-node';
import { HappensBetweenNode } from '../nodes/rule/trigger/happens-between-node';
import { CustomNodeTypes } from '../types/node-types';
import { EventWithinNode } from '../nodes/rule/trigger/event-within-node';
import { DnDSidebar } from './dnd-sidebar';
import { ExecuteButton } from './execute-button';
import type {
  Connection,
  Edge,
  Node,
  NodeTypes,
  ReactFlowInstance,
} from '@xyflow/react';
import { useTheme } from '@/features/shared/components/theme-provider';
import '@xyflow/react/dist/style.css';

export function FlowsBoard() {
  const { appTheme: theme } = useTheme();

  // --- Canvas 1: Connector nodes only ---
  const [nodes1, setNodes1, onNodesChange1] = useNodesState<Node>([]);
  const [edges1, setEdges1, onEdgesChange1] = useEdgesState<Edge>([]);
  const [rfInstance1, setRfInstance1] = useState<ReactFlowInstance | null>(
    null
  );
  const nodeTypes1: NodeTypes = {
    [CustomNodeTypes.Connector]: ConnectorNode,
    [CustomNodeTypes.PriceChanges]: PriceChangesNode,
    [CustomNodeTypes.EventWithin]: EventWithinNode,
    [CustomNodeTypes.HappensBetween]: HappensBetweenNode,
  };
  const onConnect1 = (params: Connection) =>
    setEdges1((e) => addEdge(params, e));

  // --- Canvas 2: PriceChanges nodes only ---
  const [nodes2, setNodes2, onNodesChange2] = useNodesState<Node>([]);
  const [edges2, setEdges2, onEdgesChange2] = useEdgesState<Edge>([]);
  const [rfInstance2, setRfInstance2] = useState<ReactFlowInstance | null>(
    null
  );
  const nodeTypes2: NodeTypes = { [CustomNodeTypes.Connector]: ConnectorNode };
  const onConnect2 = (params: Connection) =>
    setEdges2((e) => addEdge(params, e));

  // --- Canvas 3: EventWithin + HappensBetween nodes ---
  const [nodes3, setNodes3, onNodesChange3] = useNodesState<Node>([]);
  const [edges3, setEdges3, onEdgesChange3] = useEdgesState<Edge>([]);
  const [rfInstance3, setRfInstance3] = useState<ReactFlowInstance | null>(
    null
  );
  const nodeTypes3: NodeTypes = { [CustomNodeTypes.Connector]: ConnectorNode };
  const onConnect3 = (params: Connection) =>
    setEdges3((e) => addEdge(params, e));

  const flows = [
    {
      id: '1',
      allowedTypes: [
        CustomNodeTypes.Connector,
        CustomNodeTypes.HappensBetween,
        CustomNodeTypes.PriceChanges,
        CustomNodeTypes.EventWithin,
      ],
      addNode: (node: Node) => setNodes1((nds) => nds.concat(node)),
    },
    {
      id: '2',
      allowedTypes: [CustomNodeTypes.Connector],
      addNode: (node: Node) => setNodes2((nds) => nds.concat(node)),
    },
    {
      id: '3',
      allowedTypes: [CustomNodeTypes.Connector],
      addNode: (node: Node) => setNodes3((nds) => nds.concat(node)),
    },
  ];

  const onSave = useCallback(() => {
    // save each canvas separately
    if (rfInstance1)
      localStorage.setItem('flow1', JSON.stringify(rfInstance1.toObject()));
    if (rfInstance2)
      localStorage.setItem('flow2', JSON.stringify(rfInstance2.toObject()));
    if (rfInstance3)
      localStorage.setItem('flow3', JSON.stringify(rfInstance3.toObject()));
  }, [rfInstance1, rfInstance2, rfInstance3]);

  return (
    <DnDProvider>
      <div className="flex w-full h-[600px] gap-4">
        {/* Canvas 1 */}
        <div id="1" className="flex-1 border">
          <ReactFlowProvider>
            <ReactFlow
              colorMode={theme}
              nodes={nodes1}
              edges={edges1}
              onNodesChange={onNodesChange1}
              onEdgesChange={onEdgesChange1}
              onConnect={onConnect1}
              nodeTypes={nodeTypes1}
              onInit={setRfInstance1}
              fitView
            >
              <Background />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Canvas 2 */}
        <div id="2" className="flex-1 border">
          <ReactFlowProvider>
            <ReactFlow
              colorMode={theme}
              nodes={nodes2}
              edges={edges2}
              onNodesChange={onNodesChange2}
              onEdgesChange={onEdgesChange2}
              onConnect={onConnect2}
              nodeTypes={nodeTypes2}
              onInit={setRfInstance2}
              fitView
            >
              <Background />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Canvas 3 */}
        <div id="3" className="flex-1 border">
          <ReactFlowProvider>
            <ReactFlow
              colorMode={theme}
              nodes={nodes3}
              edges={edges3}
              onNodesChange={onNodesChange3}
              onEdgesChange={onEdgesChange3}
              onConnect={onConnect3}
              nodeTypes={nodeTypes3}
              onInit={setRfInstance3}
              fitView
            >
              <Background />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
      <ReactFlowProvider>
        <DnDSidebar flows={flows} />

        <div className="mt-2">
          <ExecuteButton onExecute={onSave} />
        </div>
      </ReactFlowProvider>
    </DnDProvider>
  );
}
