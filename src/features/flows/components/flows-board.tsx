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
import { PriceChangesNode } from '../nodes/rule/trigger/price-changes-node';
import { CustomNodeTypes } from '../types/node-types';
import { HappensBetweenNode } from '../nodes/rule/predicate/happens-between-node';
import { AndNode } from '../nodes/connector/and-node';
import { OrNode } from '../nodes/connector/or-node';
import { PriceHigherLowerNode } from '../nodes/rule/predicate/price-higher-lower-node';
import { EventWithinNode } from '../nodes/rule/predicate/event-within-node';
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

const nodeTypes: NodeTypes = {
  [CustomNodeTypes.And]: AndNode,
  [CustomNodeTypes.Or]: OrNode,
  [CustomNodeTypes.PriceChanges]: PriceChangesNode,
  [CustomNodeTypes.EventWithin]: EventWithinNode,
  [CustomNodeTypes.HappensBetween]: HappensBetweenNode,
  [CustomNodeTypes.PriceHigherLower]: PriceHigherLowerNode,
};

export function FlowsBoard() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges]
  );

  const { appTheme: theme } = useTheme();

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem('example-flow', JSON.stringify(flow));
    }
  }, [rfInstance]);

  return (
    <ReactFlowProvider>
      <DnDProvider>
        <div className="flex w-full h-[500px]">
          <div className="flex-1">
            <ReactFlow
              colorMode={theme}
              nodes={nodes}
              edges={edges}
              nodeExtent={[
                [-3000, -3000],
                [3000, 3000],
              ]}
              translateExtent={[
                [-3000, -3000],
                [3000, 3000],
              ]}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onInit={setRfInstance}
              zoomOnScroll={false}
              fitView
            >
              <Background />
            </ReactFlow>
          </div>
          <div className="w-64 bg-(var[--muted]) p-4">
            {rfInstance && (
              <DnDSidebar
                addNode={(node) => setNodes((nds) => nds.concat(node))}
                screenToFlowPosition={rfInstance.screenToFlowPosition}
              />
            )}
          </div>
          <ExecuteButton onExecute={onSave} />
        </div>
      </DnDProvider>
    </ReactFlowProvider>
  );
}
