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
import { RuleNode } from '../nodes/rule/rule-node';
// import { evaluators } from '../utils/evaluators';
import { ConnectorNode } from '../nodes/connector/connector-node';
import { PriceChangesNode } from '../nodes/rule/trigger/price-changes-node';
import { DnDSidebar } from './dnd-sidebar';
import { ExecuteButton } from './execute-button';
import type { Connection, NodeTypes, ReactFlowInstance } from '@xyflow/react';
import { useTheme } from '@/features/shared/components/theme-provider';
import '@xyflow/react/dist/style.css';



const nodeTypes: NodeTypes = {
  ruleNode: RuleNode,
  connectorNode: ConnectorNode,
  priceChangesNode: PriceChangesNode,
};

export function FlowsBoard() {
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              // panOnDrag={false}
              // zoomOnPinch={false}
              onInit={setRfInstance}
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
          <ExecuteButton onExecute={onSave} />
        </div>
      </DnDProvider>
    </ReactFlowProvider>
  );
}
