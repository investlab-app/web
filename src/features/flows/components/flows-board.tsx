import {
  Background,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useCallback, useState } from 'react';
import { DnDProvider } from '../utils/dnd-context';
import { PriceChangesNode } from '../nodes/trigger/price-changes-node';
import { InstrumentBoughtSoldNode } from '../nodes/trigger/instrument-bought-sold-node';
import { HappensBetweenNode } from '../nodes/rule/happens-between-node';
import { PriceHigherLowerNode } from '../nodes/rule/price-higher-lower-node';
import { AndNode } from '../nodes/connector/and-node';
import { OrNode } from '../nodes/connector/or-node';
import { CustomNodeTypes } from '../types/node-types-2';
import { useValidators } from '../hooks/use-validators';
import { BuySellAmountNode } from '../nodes/action/buy-sell-amount-node';
import { BuySellPriceNode } from '../nodes/action/buy-sell-price-node';
import { FlowNode } from '../nodes/flow/flow-node';
import { BuySellPercentNode } from '../nodes/action/buy-sell-percent-node';
import { CheckEveryNode } from '../nodes/trigger/check-every-node';
import { SendNotificationNode } from '../nodes/action/send-notification-node';
import { HappensWithinNode } from '../nodes/rule/happens-within-node';
import { DnDSidebar } from './sidebar/dnd-sidebar';
import { SaveButton } from './execute-button';
import type {
  Connection,
  Edge,
  Node,
  NodeTypes,
  ReactFlowInstance,
} from '@xyflow/react';
import { useTheme } from '@/features/shared/components/theme-provider';
import '@xyflow/react/dist/style.css';
import { PriceOfNode } from '../nodes/number/priceOf';
import { PriceOfNodeProps } from '../utils/price-of-node';

const nodeTypes: NodeTypes = {
  [CustomNodeTypes.PriceOf]: PriceOfNode,
  [CustomNodeTypes.And]: AndNode,
  [CustomNodeTypes.Or]: OrNode,
  [CustomNodeTypes.PriceChanges]: PriceChangesNode,
  [CustomNodeTypes.CheckEvery]: CheckEveryNode,
  [CustomNodeTypes.InstrumentBoughtSold]: InstrumentBoughtSoldNode,
  [CustomNodeTypes.BuySellAmount]: BuySellAmountNode,
  [CustomNodeTypes.BuySellPrice]: BuySellPriceNode,
  [CustomNodeTypes.BuySellPercent]: BuySellPercentNode,
  [CustomNodeTypes.SendNotification]: SendNotificationNode,
};

export function FlowsBoard() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
    {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { settings: new PriceOfNodeProps()},
    type: CustomNodeTypes.PriceOf,
  },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { appTheme: theme } = useTheme();
  const { validateConnection } = useValidators();
 
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem('example-flow', JSON.stringify(flow));
    }
  }, [rfInstance]);

  return (
    <DnDProvider>
      <div className="flex w-full h-[700px]">
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
            isValidConnection={validateConnection}
            zoomOnScroll={false}
          >
            <Background />
          </ReactFlow>
        </div>
        <div className="w-70 bg-(var[--muted]) p-4">
          <SaveButton onSave={onSave} />
          {rfInstance && (
            <DnDSidebar
              addNode={(node) => setNodes((nds) => nds.concat(node))}
              screenToFlowPosition={rfInstance.screenToFlowPosition}
            />
          )}
        </div>
      </div>
    </DnDProvider>
  );
}
