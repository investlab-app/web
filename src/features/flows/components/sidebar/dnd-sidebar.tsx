import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDnD } from '../../hooks/use-dnd';
import { CustomNodeTypes } from '../../types/node-types-2';
import { DragGhost } from '../drag-ghost';
import { PriceOfNodeUI } from '../../nodes/number/price-of-node-ui';
import { PriceOfNodeSettings } from '../../nodes/number/price-of-node-settings';
import { BuySellPriceNodeUI } from '../../nodes/action/buy-sell-price-node';
import { BuySellPriceNodeSettings } from '../../nodes/action/buy-sell-price-node-settings';
import { BuySellPercentNodeSettings } from '../../nodes/action/buy-sell-percent-node-settings';
import { BuySellPercentNodeUI } from '../../nodes/action/buy-sell-percent-node';
import { BuySellAmountNodeUI } from '../../nodes/action/buy-sell-amount-node-ui';
import { BuySellAmountNodeSettings } from '../../nodes/action/buy-sell-amount-node-settings';
import { CheckEveryNodeUI } from '../../nodes/trigger/check-every-node';
import { CheckEveryNodeSettings } from '../../nodes/trigger/check-every-node-settings';
import { InstrumentBoughtSoldNodeUI } from '../../nodes/trigger/instrument-bought-sold-node';
import { InstrumentBoughtSoldNodeSettings } from '../../nodes/trigger/instrument-bought-sold-node-settings';
import { PriceChangesNodeUI } from '../../nodes/trigger/price-changes-node';
import { PriceChangesNodeSettings } from '../../nodes/trigger/price-changes-node-settings';
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
        {/* <SidebarSection
          title={t('flows.sidebar.logical')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.logical_node'))}
          children={{
            [CustomNodeTypes.And]: {
              component: AndNodeUI,
              props: {},
            },
            [CustomNodeTypes.Or]: {
              component: OrNodeUI,
              props: {},
            },
          }}
        />

        <SidebarSection
          title={t('flows.sidebar.flow')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.flow_node'))}
          children={{
            [CustomNodeTypes.IfThenElse]: {
              component: FlowNodeUI,
              props: {},
            },
          }}
        />

        <SidebarSection
          title={t('flows.sidebar.triggers')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.trigger_node'))}
          children={{
            [CustomNodeTypes.PriceChanges]: {
              component: PriceChangesNodeUI,
              props: {
                value: '',
                direction: 'over',
                price: 100,
              },
            },
            [CustomNodeTypes.InstrumentBoughtSold]: {
              component: InstrumentBoughtSoldNodeUI,
              props: {
                value: '',
                action: 'bought',
              },
            },
            [CustomNodeTypes.CheckEvery]: {
              component: CheckEveryNodeUI,
              props: {
                interval: 1,
                unit: 'day',
              },
            },
          }}
        />

        <SidebarSection
          title={t('flows.sidebar.rules')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.rule_node'))}
          children={{
            [CustomNodeTypes.HappensWithin]: {
              component: HappensWithinNodeUI,
              props: {
                value: 1,
              },
            },
            [CustomNodeTypes.HappensBetween]: {
              component: HappensBetweenNodeUI,
              props: {
                startDate: Date.now(),
                endDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
              },
            },
            [CustomNodeTypes.PriceOverUnder]: {
              component: PriceHigherLowerNodeUI,
              props: {
                value: 100,
                state: 'over',
              },
            },
          }}
        />

        <SidebarSection
          title={t('flows.sidebar.actions')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.action_node'))}
          children={{
            [CustomNodeTypes.SendNotification]: {
              component: SendNotificationNodeUI,
              props: {
                type: 'email',
              },
            },
            [CustomNodeTypes.BuySellPercent]: {
              component: BuySellPercentNodeUI,
              props: {
                action: 'buy',
                percent: 10,
                instrument: '',
              },
            },
            [CustomNodeTypes.BuySellPrice]: {
              component: BuySellPriceNodeUI,
              props: {
                action: 'buy',
                price: 100,
                instrument: '',
              },
            },
            [CustomNodeTypes.BuySellAmount]: {
              component: BuySellAmountNodeUI,
              props: {
                action: 'buy',
                amount: 1,
                instrument: '',
              },
            },
          }}
        /> */}
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
          title={t('flows.sidebar.rules')}
          createNodeFunc={createAddNewNode}
          onDragStart={onDragStart}
          setGhostType={() => setType(t('flows.ghosts.rule_node'))}
          children={{
            [CustomNodeTypes.PriceOf]: {
              component: PriceOfNodeUI,
              settingsType: PriceOfNodeSettings,
            },
          }}
        />
      </div>
    </div>
  );
}
