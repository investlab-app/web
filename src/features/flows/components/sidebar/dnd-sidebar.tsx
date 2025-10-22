import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDnD } from '../../hooks/use-dnd';
import { PriceChangesNodeUI } from '../../nodes/trigger/price-changes-node';
import { InstrumentBoughtSoldNodeUI } from '../../nodes/trigger/instrument-bought-sold-node';
import { CustomNodeTypes } from '../../types/node-types';
import { HappensBetweenNodeUI } from '../../nodes/rule/happens-between-node';
import { BuySellAmountNodeUI } from '../../nodes/action/buy-sell-amount-node';
import { BuySellPriceNodeUI } from '../../nodes/action/buy-sell-price-node';
import { BuySellPercentNodeUI } from '../../nodes/action/buy-sell-percent-node';
import { SendNotificationNodeUI } from '../../nodes/action/send-notification-node';
import { PriceHigherLowerNodeUI } from '../../nodes/rule/price-higher-lower-node';
import { AndNodeUI } from '../../nodes/connector/and-node';
import { CheckEveryNodeUI } from '../../nodes/trigger/check-every-node';
import { HappensWithinNodeUI } from '../../nodes/rule/happens-within-node';
import { FlowNodeUI } from '../../nodes/flow/flow-node';
import { OrNodeUI } from '../../nodes/connector/or-node';
import { DragGhost } from '../drag-ghost';
import { SidebarSection } from './section';
import type { OnDropAction } from '../../utils/dnd-context';
import type { Node, XYPosition } from '@xyflow/react';

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
      data: Record<string, boolean | string | number>
    ): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        const flowPos = screenToFlowPosition(position);

        const newNode = {
          id: getId(),
          type: nodeType,
          position: flowPos,
          data: data,
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
        />
      </div>
    </div>
  );
}
