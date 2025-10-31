import {
  Background,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useCallback, useState } from 'react';
import { PriceOfNode } from '../nodes/number/price-of-node-settings';
import { CustomNodeTypes } from '../types/node-types-2';
import { BuySellAmountNode } from '../nodes/action/buy-sell-amount-node-settings';
import { BuySellPriceNode } from '../nodes/action/buy-sell-price-node-settings';
import { OrNode } from '../nodes/logic-operator/or-node-settings';
import { AndNode } from '../nodes/logic-operator/and-node-settings';
import { NotNode } from '../nodes/logic-operator/not-node-settings';
import { BuySellPercentNode } from '../nodes/action/buy-sell-percent-node-settings';
import { AddNode } from '../nodes/math/add-node-settings';
import { SubtractNode } from '../nodes/math/subtract-node-settings';
import { MultiplyNode } from '../nodes/math/multiply-node-settings';
import { DivideNode } from '../nodes/math/divide-node-settings';
import { StaysAboveBelowNode } from '../nodes/predicate/stays-above-below-node-settings';
import { InstrumentBoughtSoldNode } from '../nodes/trigger/instrument-bought-sold-node-settings';
import { FlowNode } from '../nodes/flow/flow-if-node-settings';
import { IndicatorNode } from '../nodes/number/indicator-node-settings';
import { NumberOfAssetsNode } from '../nodes/number/number-of-assets-node-settings';
import { MoneyAvailableNode } from '../nodes/number/money-available-node-settings';
import { ValueOfAssetsNode } from '../nodes/number/value-of-assets-node-settings';
import { PriceChangeNode } from '../nodes/number/price-change-node-settings';
import { NumericFlowNode } from '../nodes/flow/numeric-flow-if-node-settings';
import { IsGreaterLessNode } from '../nodes/predicate/is-greater-less-node-settings';
import { HasRisenFallenNode } from '../nodes/predicate/has-risen-fallen-node-settings';
import { CheckEveryNode } from '../nodes/trigger/check-every-node-settings';
import { PriceChangesNode } from '../nodes/trigger/price-changes-node-settings';
import { SendNotificationNode } from '../nodes/action/send-notification-node-settings';
import { StaysTheSameNode } from '../nodes/predicate/stays-the-same-node-settings';
import { DnDProvider } from '../utils/dnd-context';
import { ChangeOverTime } from '../nodes/math/change-over-time-node-settings';
import { OccurredXTimesNode } from '../nodes/logic-operator/occurred-x-times-node-settings';
import { useValidators } from '../hooks/use-validators';
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

const nodeTypes: NodeTypes = {
  [CustomNodeTypes.Not]: NotNode,
  [CustomNodeTypes.And]: AndNode,
  [CustomNodeTypes.Or]: OrNode,
  [CustomNodeTypes.OccurredXTimes]: OccurredXTimesNode,

  [CustomNodeTypes.Add]: AddNode,
  [CustomNodeTypes.Subtract]: SubtractNode,
  [CustomNodeTypes.Multiply]: MultiplyNode,
  [CustomNodeTypes.Divide]: DivideNode,
  [CustomNodeTypes.ChangeOverTime]: ChangeOverTime,

  [CustomNodeTypes.FlowIf]: FlowNode,
  [CustomNodeTypes.NumbericFlowIf]: NumericFlowNode,

  [CustomNodeTypes.StaysAboveBelow]: StaysAboveBelowNode,
  [CustomNodeTypes.HasRisenFallen]: HasRisenFallenNode,
  [CustomNodeTypes.IsGreaterLesser]: IsGreaterLessNode,
  [CustomNodeTypes.StaysTheSame]: StaysTheSameNode,

  [CustomNodeTypes.PriceOf]: PriceOfNode,
  [CustomNodeTypes.MoneyAvailable]: MoneyAvailableNode,
  [CustomNodeTypes.NumberOfAssets]: NumberOfAssetsNode,
  [CustomNodeTypes.ValueOfAssets]: ValueOfAssetsNode,
  [CustomNodeTypes.Indicator]: IndicatorNode,
  [CustomNodeTypes.PriceChange]: PriceChangeNode,

  [CustomNodeTypes.PriceChanges]: PriceChangesNode,
  [CustomNodeTypes.CheckEvery]: CheckEveryNode,
  [CustomNodeTypes.InstrumentBoughtSold]: InstrumentBoughtSoldNode,

  [CustomNodeTypes.SendNotification]: SendNotificationNode,
  [CustomNodeTypes.BuySellAmount]: BuySellAmountNode,
  [CustomNodeTypes.BuySellPrice]: BuySellPriceNode,
  [CustomNodeTypes.BuySellPercent]: BuySellPercentNode,
};

export function FlowsBoard() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { appTheme: theme } = useTheme();
  const { validateConnectionNew } = useValidators();

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
            isValidConnection={validateConnectionNew}
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
