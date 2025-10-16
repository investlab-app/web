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
import { CustomNodeTypes } from '../types/node-types';
import { useValidators } from '../hooks/use-validators';
import { BuySellAmountNode } from '../nodes/action/buy-sell-amount-node';
import { BuySellPriceNode } from '../nodes/action/buy-sell-price-node';
import { BuySellPercentNode } from '../nodes/action/buy-sell-percent-node';
import { IfNode } from '../nodes/flow/if-node';
import { ThenElseNode } from '../nodes/flow/then-else-node';
import { ThenNode } from '../nodes/flow/then-node';
import { HappensWithinNode } from '../nodes/rule/happens-within-node';
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
  [CustomNodeTypes.If]: IfNode,
  [CustomNodeTypes.ThenElse]: ThenElseNode,
  [CustomNodeTypes.Then]: ThenNode,
  [CustomNodeTypes.PriceChanges]: PriceChangesNode,
  [CustomNodeTypes.InstrumentBoughtSold]: InstrumentBoughtSoldNode,
  [CustomNodeTypes.HappensWithin]: HappensWithinNode,
  [CustomNodeTypes.HappensBetween]: HappensBetweenNode,
  [CustomNodeTypes.PriceOverUnder]: PriceHigherLowerNode,
  [CustomNodeTypes.BuySellAmount]: BuySellAmountNode,
  [CustomNodeTypes.BuySellPrice]: BuySellPriceNode,
  [CustomNodeTypes.BuySellPercent]: BuySellPercentNode,
};

export function FlowsBoard() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
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
            isValidConnection={validateConnection}
            zoomOnScroll={false}
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
  );
}
