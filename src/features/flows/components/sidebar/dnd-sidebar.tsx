import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDnD } from '../../hooks/use-dnd';
import { CustomNodeTypes } from '../../types/node-types-2';
import { DragGhost } from '../drag-ghost';
import { PriceOfNodeUI } from '../../nodes/number/price-of-node-ui';
import { PriceOfNodeSettings } from '../../nodes/number/price-of-node-settings';
import { MoneyAvailableNodeUI } from '../../nodes/number/money-available-node-ui';
import { MoneyAvailableNodeSettings } from '../../nodes/number/money-available-node-settings';
import { NumberOfAssetsNodeUI } from '../../nodes/number/number-of-assets-node-ui';
import { NumberOfAssetsNodeSettings } from '../../nodes/number/number-of-assets-node-settings';
import { ValueOfAssetsNodeUI } from '../../nodes/number/value-of-assets-node-ui';
import { ValueOfAssetsNodeSettings } from '../../nodes/number/value-of-assets-node-settings';
import { IndicatorNodeUI } from '../../nodes/number/indicator-node-ui';
import { IndicatorNodeSettings } from '../../nodes/number/indicator-node-settings';
import { PriceChangeNodeUI } from '../../nodes/number/price-change-node-ui';
import { PriceChangeNodeSettings } from '../../nodes/number/price-change-node-settings';
import { BuySellPriceNodeUI } from '../../nodes/action/buy-sell-price-node-ui';
import { BuySellPriceNodeSettings } from '../../nodes/action/buy-sell-price-node-settings';
import { BuySellPercentNodeSettings } from '../../nodes/action/buy-sell-percent-node-settings';
import { BuySellPercentNodeUI } from '../../nodes/action/buy-sell-percent-node-ui';
import { BuySellAmountNodeUI } from '../../nodes/action/buy-sell-amount-node-ui';
import { BuySellAmountNodeSettings } from '../../nodes/action/buy-sell-amount-node-settings';
import { CheckEveryNodeUI } from '../../nodes/trigger/check-every-node-ui';
import { CheckEveryNodeSettings } from '../../nodes/trigger/check-every-node-settings';
import { InstrumentBoughtSoldNodeUI } from '../../nodes/trigger/instrument-bought-sold-node';
import { InstrumentBoughtSoldNodeSettings } from '../../nodes/trigger/instrument-bought-sold-node-settings';
import { PriceChangesNodeUI } from '../../nodes/trigger/price-changes-node';
import { PriceChangesNodeSettings } from '../../nodes/trigger/price-changes-node-settings';
import { AndNodeUI } from '../../nodes/logic-operator/and-node';
import { FlowIfNodeUI } from '../../nodes/flow/flow-if-node-ui';
import { NumericFlowIfNodeUI } from '../../nodes/flow/numeric-flow-if-node-ui';
import { FlowIfNodeSettings } from '../../nodes/flow/flow-if-node-settings';
import { NumericFlowIfNodeSettings } from '../../nodes/flow/numeric-flow-if-node-settings';
import { AddNodeUI } from '../../nodes/math/add-node-ui';
import { AddNodeSettings } from '../../nodes/math/add-node-settings';
import { SubtractNodeUI } from '../../nodes/math/subtract-node-ui';
import { SubtractNodeSettings } from '../../nodes/math/subtract-node-settings';
import { MultiplyNodeUI } from '../../nodes/math/multiply-node-ui';
import { MultiplyNodeSettings } from '../../nodes/math/multiply-node-settings';
import { DivideNodeUI } from '../../nodes/math/divide-node-ui';
import { DivideNodeSettings } from '../../nodes/math/divide-node-settings';
import { AndNodeSettings } from '../../nodes/logic-operator/and-node-settings';
import { OrNodeUI } from '../../nodes/logic-operator/or-node';
import { OrNodeSettings } from '../../nodes/logic-operator/or-node-settings';
import { NotNodeSettings } from '../../nodes/logic-operator/not-node-settings';
import { NotNodeUI } from '../../nodes/logic-operator/not-node';
import { StaysAboveBelowNodeUI } from '../../nodes/predicate/stays-above-below-node-ui';
import { StaysAboveBelowNodeSettings } from '../../nodes/predicate/stays-above-below-node-settings';
import { SidebarSection } from './section';
import type { Constructor } from './section';
import type { OnDropAction } from '../../utils/dnd-context';
import type { Node, XYPosition } from '@xyflow/react';
import type { NodeSettings } from '../../nodes/node-settings';

let nodeid = 0;
const getId = () => `node_${nodeid++}`;

interface DnDSidebarProps {
  addNode: (node: Node) => void;
  screenToFlowPosition: (pos: XYPosition) => XYPosition;
}

export function DnDSidebar({ addNode, screenToFlowPosition }: DnDSidebarProps) {
  const { t } = useTranslation();
  const { onDragStart, isDragging } = useDnD();
  const [type, setType] = useState<string | null>(null);

  const createAddNewNode = useCallback(
    (
      nodeType: string,
      settingsType: Constructor<NodeSettings>
    ): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        const flowPos = screenToFlowPosition(position);

        const newNode = {
          id: getId(),
          type: nodeType,
          position: flowPos,
          data: { settings: new settingsType() },
        };
        addNode(newNode);
        setType(null);
      };
    },
    [setType, addNode, screenToFlowPosition]
  );

  return (
    <div className="py-2">
      {isDragging && <DragGhost type={type} />}
      <div>
        <SidebarSection
          title={t('flows.sidebar.logical')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.logical_node'))}
          children={{
            [CustomNodeTypes.And]: {
              component: AndNodeUI,
              settingsType: AndNodeSettings,
            },
            [CustomNodeTypes.Or]: {
              component: OrNodeUI,
              settingsType: OrNodeSettings,
            },
            [CustomNodeTypes.Not]: {
              component: NotNodeUI,
              settingsType: NotNodeSettings,
            },
          }}
        />
        <SidebarSection
          title={t('flows.sidebar.triggers')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.trigger_node'))}
          children={{
            [CustomNodeTypes.CheckEvery]: {
              component: CheckEveryNodeUI,
              settingsType: CheckEveryNodeSettings,
            },
            [CustomNodeTypes.InstrumentBoughtSold]: {
              component: InstrumentBoughtSoldNodeUI,
              settingsType: InstrumentBoughtSoldNodeSettings,
            },
            [CustomNodeTypes.PriceChanges]: {
              component: PriceChangesNodeUI,
              settingsType: PriceChangesNodeSettings,
            },
          }}
        />
        <SidebarSection
          title={t('flows.sidebar.actions')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.action_node'))}
          children={{
            [CustomNodeTypes.BuySellAmount]: {
              component: BuySellAmountNodeUI,
              settingsType: BuySellAmountNodeSettings,
            },
            [CustomNodeTypes.BuySellPercent]: {
              component: BuySellPercentNodeUI,
              settingsType: BuySellPercentNodeSettings,
            },
            [CustomNodeTypes.BuySellPrice]: {
              component: BuySellPriceNodeUI,
              settingsType: BuySellPriceNodeSettings,
            },
          }}
        />
        <SidebarSection
          title={t('flows.sidebar.numbers')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.number_node'))}
          children={{
            [CustomNodeTypes.PriceOf]: {
              component: PriceOfNodeUI,
              settingsType: PriceOfNodeSettings,
            },
            [CustomNodeTypes.MoneyAvailable]: {
              component: MoneyAvailableNodeUI,
              settingsType: MoneyAvailableNodeSettings,
            },
            [CustomNodeTypes.NumberOfAssets]: {
              component: NumberOfAssetsNodeUI,
              settingsType: NumberOfAssetsNodeSettings,
            },
            [CustomNodeTypes.ValueOfAssets]: {
              component: ValueOfAssetsNodeUI,
              settingsType: ValueOfAssetsNodeSettings,
            },
            [CustomNodeTypes.Indicator]: {
              component: IndicatorNodeUI,
              settingsType: IndicatorNodeSettings,
            },
            [CustomNodeTypes.PriceChange]: {
              component: PriceChangeNodeUI,
              settingsType: PriceChangeNodeSettings,
            },
          }}
        />
        <SidebarSection
          title={t('flows.sidebar.conditionals')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.conditional_node'))}
          children={{
            [CustomNodeTypes.FlowIf]: {
              component: FlowIfNodeUI,
              settingsType: FlowIfNodeSettings,
            },
            [CustomNodeTypes.NumbericFlowIf]: {
              component: NumericFlowIfNodeUI,
              settingsType: NumericFlowIfNodeSettings,
            },
          }}
        />
        <SidebarSection
          title={t('flows.sidebar.math')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.math_node'))}
          children={{
            [CustomNodeTypes.Add]: {
              component: AddNodeUI,
              settingsType: AddNodeSettings,
            },
            [CustomNodeTypes.Subtract]: {
              component: SubtractNodeUI,
              settingsType: SubtractNodeSettings,
            },
            [CustomNodeTypes.Multiply]: {
              component: MultiplyNodeUI,
              settingsType: MultiplyNodeSettings,
            },
            [CustomNodeTypes.Divide]: {
              component: DivideNodeUI,
              settingsType: DivideNodeSettings,
            },
          }}
        />
        <SidebarSection
          title={t('flows.sidebar.predicates')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.predicate_node'))}
          children={{
            [CustomNodeTypes.StaysAboveBelow]: {
              component: StaysAboveBelowNodeUI,
              settingsType: StaysAboveBelowNodeSettings,
            },
          }}
        />
      </div>
    </div>
  );
}
