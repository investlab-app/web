import { useCallback, useState } from 'react';
import { useDnD } from '../hooks/use-dnd';
// import { EventWithinNodeUI } from '../nodes/rule/predicate/event-within-node';
import { PriceChangesNodeUI } from '../nodes/rule/trigger/price-changes-node';
import { RuleNodeTypes, TriggerNodeTypes } from '../types/node-types';
// import { HappensBetweenNodeUI } from '../nodes/rule/predicate/happens-between-node';
import { PriceHigherLowerNodeUI } from '../nodes/rule/predicate/price-higher-lower-node';
// import { AndNodeUI } from '../nodes/connector/and-node';
// import { OrNodeUI } from '../nodes/connector/or-node';
// import { CustomNodeTypes } from '../types/node-types';
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
        {/* <div
          onPointerDown={(event) => {
            setType('connectorNode');
            onDragStart(event, createAddNewNode(CustomNodeTypes.And, {}));
          }}
        >
          <AndNodeUI id={'preview-and'} />
        </div>
        <div
          onPointerDown={(event) => {
            setType('and node');
            onDragStart(event, createAddNewNode(CustomNodeTypes.Or, {}));
          }}
        >
          <OrNodeUI id={'preview-and'} />
        </div>
        <div>Triggers</div> */}
        <div
          onPointerDown={(event) => {
            setType('priceChangesNode');
            onDragStart(
              event,
              createAddNewNode(TriggerNodeTypes.PriceChanges, {
                value: '',
                direction: 'rise',
              })
            );
          }}
        >
          <PriceChangesNodeUI nodeId="test" value="TICKER" direction="rises" />
        </div>
        {/* <div>Prediates</div>
        <div
          onPointerDown={(event) => {
            setType('eventWithinNode');
            onDragStart(
              event,
              createAddNewNode(CustomNodeTypes.EventWithin, {
                value: 1,
              })
            );
          }}
        >
          <EventWithinNodeUI value={1} />
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
            startDate={new Date()}
            endDate={new Date(7 * 24 * 60 * 60 * 1000 + Date.now())}
          />
        </div> */}
        <div
          onPointerDown={(event) => {
            setType('price higher lower');
            onDragStart(
              event,
              createAddNewNode(RuleNodeTypes.PriceOverUnder, {
                value: 100,
                state: 'over',
              })
            );
          }}
        >
          <PriceHigherLowerNodeUI nodeId="testa" value={100} state="over" />
        </div>
      </div>
    </div>
  );
}
