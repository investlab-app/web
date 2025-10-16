import { useCallback, useState } from 'react';
import { useDnD } from '../hooks/use-dnd';
import { PriceChangesNodeUI } from '../nodes/trigger/price-changes-node';
import { InstrumentBoughtSoldNodeUI } from '../nodes/trigger/instrument-bought-sold-node';
import { CustomNodeTypes } from '../types/node-types';
import { HappensBetweenNodeUI } from '../nodes/rule/happens-between-node';
import { BuySellAmountNodeUI } from '../nodes/action/buy-sell-amount-node';
import { BuySellPriceNodeUI } from '../nodes/action/buy-sell-price-node';
import { IfNodeUI } from '../nodes/flow/if-node';
import { ThenNodeUI } from '../nodes/flow/then-node';
import { PriceHigherLowerNodeUI } from '../nodes/rule/price-higher-lower-node';
import { AndNodeUI } from '../nodes/connector/and-node';
import { HappensWithinNodeUI } from '../nodes/rule/happens-within-node';
import { OrNodeUI } from '../nodes/connector/or-node';
import { ThenElseNodeUI } from '../nodes/flow/then-else-node';
import { DragGhost } from './drag-ghost';
import type { OnDropAction } from '../utils/dnd-context';
import type { Node, XYPosition } from '@xyflow/react';

let nodeid = 0;
const getId = () => `node_${nodeid++}`;

interface DnDSidebarProps {
  addNode: (node: Node) => void;
  screenToFlowPosition: (pos: XYPosition) => XYPosition;
}

export function DnDSidebar({ addNode, screenToFlowPosition }: DnDSidebarProps) {
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
        console.log('love you');
        addNode(newNode);
        setType(null);
      };
    },
    [setType, addNode, screenToFlowPosition]
  );

  return (
    <div className="p-2">
      {isDragging && <DragGhost type={type} />}
      <div>
        <div>Logical Operators</div>
        <div
          onPointerDown={(event) => {
            setType('connectorNode');
            onDragStart(event, createAddNewNode(CustomNodeTypes.And, {}));
          }}
        >
          <AndNodeUI nodeId={'preview-and'} preview={true} />
        </div>
        <div
          onPointerDown={(event) => {
            setType('and node');
            onDragStart(event, createAddNewNode(CustomNodeTypes.Or, {}));
          }}
        >
          <OrNodeUI nodeId={'preview-and'} preview={true} />
        </div>
        <div>Flow Nodes</div>
        <div
          onPointerDown={(event) => {
            setType('if');
            onDragStart(event, createAddNewNode(CustomNodeTypes.If, {}));
          }}
        >
          <IfNodeUI nodeId={'preview-if'} preview={true} />
        </div>
        <div
          onPointerDown={(event) => {
            setType('then node');
            onDragStart(event, createAddNewNode(CustomNodeTypes.Then, {}));
          }}
        >
          <ThenNodeUI nodeId={'preview-then'} preview={true} />
        </div>
        <div
          onPointerDown={(event) => {
            setType('then else node');
            onDragStart(event, createAddNewNode(CustomNodeTypes.ThenElse, {}));
          }}
        >
          <ThenElseNodeUI nodeId={'preview-then-else'} preview={true} />
        </div>
        <div>Triggers</div>
        <div
          onPointerDown={(event) => {
            setType('priceChangesNode');
            onDragStart(
              event,
              createAddNewNode(CustomNodeTypes.PriceChanges, {
                value: '',
                direction: 'rise',
              })
            );
          }}
        >
          <PriceChangesNodeUI
            preview={true}
            nodeId="test"
            value="TICKER"
            direction="rises"
          />
        </div>
        <div
          onPointerDown={(event) => {
            setType('instrumentBoughtSold');
            onDragStart(
              event,
              createAddNewNode(CustomNodeTypes.InstrumentBoughtSold, {
                value: '',
                action: 'bought',
              })
            );
          }}
        >
          <InstrumentBoughtSoldNodeUI
            preview={true}
            nodeId="preview-instrument"
            value="TICKER"
            action="bought"
          />
        </div>
        <div>Prediates</div>
        <div
          onPointerDown={(event) => {
            setType('eventWithinNode');
            onDragStart(
              event,
              createAddNewNode(CustomNodeTypes.HappensWithin, {
                value: 1,
              })
            );
          }}
        >
          <HappensWithinNodeUI value={1} nodeId="preview" preview={true} />
        </div>
        <div
          onPointerDown={(event) => {
            setType('happensBetweenNode');
            onDragStart(
              event,
              createAddNewNode(CustomNodeTypes.HappensBetween, {
                startDate: Date.now(),
                endDate: 7 * 24 * 60 * 60 * 1000 + Date.now(),
              })
            );
          }}
        >
          <HappensBetweenNodeUI
            preview={true}
            nodeId={'preview-between'}
            startDate={new Date()}
            endDate={new Date(7 * 24 * 60 * 60 * 1000 + Date.now())}
          />
        </div>
        <div
          onPointerDown={(event) => {
            setType('price higher lower');
            onDragStart(
              event,
              createAddNewNode(CustomNodeTypes.PriceOverUnder, {
                value: 100,
                state: 'over',
              })
            );
          }}
        >
          <PriceHigherLowerNodeUI
            preview={true}
            nodeId="testa"
            value={100}
            state="over"
          />
        </div>
        Actions
        <div
          onPointerDown={(event) => {
            setType('buy sell');
            onDragStart(
              event,
              createAddNewNode(CustomNodeTypes.BuySellAmount, {
                action: 'buy',
                amount: 1,
                instrument: '',
              })
            );
          }}
        >
          <BuySellAmountNodeUI
            action="buy"
            preview={true}
            nodeId="preview-buysell"
            amount={1}
            instrument="aapl"
          />
        </div>
        <div
          onPointerDown={(event) => {
            setType('buy sell price');
            onDragStart(
              event,
              createAddNewNode(CustomNodeTypes.BuySellPrice, {
                action: 'buy',
                price: 100,
                instrument: '',
              })
            );
          }}
        >
          <BuySellPriceNodeUI
            action="buy"
            preview={true}
            nodeId="preview-buysell-price"
            price={100}
            instrument="aapl"
          />
        </div>
      </div>
    </div>
  );
}
