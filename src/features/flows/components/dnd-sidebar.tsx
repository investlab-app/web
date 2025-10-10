import { useCallback, useState } from 'react';
import { useDnD } from '../hooks/use-dnd';
import { EventWithinNodeUI } from '../nodes/rule/predicate/event-within-node-ui';
import { PriceChangesNodeUI } from '../nodes/rule/trigger/price-changes-node-ui';
import { ConnectorNodeUI } from '../nodes/connector/connector-node-ui';
import { HappensBetweenNodeUI } from '../nodes/rule/predicate/happens-between-node-ui';
import { PriceHigherLowerNodeUI } from '../nodes/rule/predicate/price-higher-lower-node-ui';
import { CustomNodeTypes } from '../types/node-types';
import { DragGhost } from './drag-ghost';
import type { OnDropAction } from '../utils/dnd-context';
import type { Node, XYPosition } from '@xyflow/react';

let nodeid = 0;
const getId = () => `dndnode_${nodeid++}`;

interface FlowTarget {
  id: string;
  addNode: (node: Node) => void;
  allowedTypes: Array<string>;
  screenToFlowPosition: (pos: XYPosition) => XYPosition;
}

interface DnDSidebarProps {
  flows: Array<FlowTarget>;
}

export function DnDSidebar({ flows }: DnDSidebarProps) {
  const { onDragStart, isDragging } = useDnD();
  const [type, setType] = useState<string | null>(null);

  const createAddNewNode = useCallback(
    (
      nodeType: string,
      data: Record<string, boolean | string | number>
    ): OnDropAction => {
      return ({ position, id }: { position: XYPosition; id: string }) => {
        const targetFlow = flows.find((flow) => flow.id === id);
        if (!targetFlow) {
          console.warn(`No flow with id "${id}" found`);
          return;
        }
        const flowPos = targetFlow.screenToFlowPosition(position);

        if (!targetFlow.allowedTypes.includes(nodeType)) {
          console.warn(
            `Node type "${nodeType}" not allowed in flow with id "${id}"`
          );
          return;
        }
        const newNode = {
          id: getId(),
          type: nodeType,
          position: flowPos,
          data: data,
        };

        targetFlow.addNode(newNode);
        setType(null);
      };
    },
    [setType, flows]
  );

  const createConnectorNode = useCallback(
    (isAnd: boolean): OnDropAction => {
      return createAddNewNode('connectorNode', { isAnd: isAnd });
    },
    [createAddNewNode]
  );

  return (
    <div className="p-2">
      {isDragging && <DragGhost type={type} />}
      <div>
        <div>Logical Operators</div>
        <div
          onPointerDown={(event) => {
            setType('connectorNode');
            onDragStart(event, createConnectorNode(true));
          }}
        >
          <ConnectorNodeUI isAnd={true} id={'preview-and'} />
        </div>
        <div
          onPointerDown={(event) => {
            setType('and node');
            onDragStart(event, createConnectorNode(false));
          }}
        >
          <ConnectorNodeUI isAnd={false} id={'preview-and'} />
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
            value="TICKER"
            direction="rises"
          />
        </div>
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
        </div>
        <div>Prediates</div>
        <div
          onPointerDown={(event) => {
            setType('price higher lower');
            onDragStart(
              event,
              createAddNewNode(CustomNodeTypes.PriceHigherLower, {
                value: 100,
                state: "over"
              })
            );
          }}
        >
          <PriceHigherLowerNodeUI
            value={100}
            state='over'
          />
        </div>
      </div>
    </div>
  );
}
