import { useReactFlow } from '@xyflow/react';
import { useCallback, useState } from 'react';
import { useDnD } from '../hooks/use-dnd';
import { EventWithinNodeUI } from '../nodes/rule/trigger/event-within-node-ui';
import { PriceChangesNodeUI } from '../nodes/rule/trigger/price-changes-node-ui';
import { ConnectorNodeUI } from '../nodes/connector/connector-node-ui';
import { HappensBetweenNodeUI } from '../nodes/rule/trigger/happens-between-node-ui';
import { CustomNodeTypes } from '../types/node-types';
import { DragGhost } from './drag-ghost';
import type { OnDropAction } from '../utils/dnd-context';
import type { Node, XYPosition } from '@xyflow/react';

let id = 0;
const getId = () => `dndnode_${id++}`;

const allowedTypesPerSection: Record<string, Array<string>> = {
  'background-triggers': [
    CustomNodeTypes.PriceChanges,
    CustomNodeTypes.EventWithin,
    CustomNodeTypes.HappensBetween,
    CustomNodeTypes.Connector
],
'background-actions': [

    CustomNodeTypes.Connector
], // Fill this with allowed actions
'background-predicates': [
    CustomNodeTypes.Connector
    
  ], // or whatever type you use
};

function isPositionInsideNode(pos: XYPosition, node: Node): boolean {
    console.log("checking position", pos, node);
  const { x, y } = node.position;
  const width = 1000;
  const height =1000;

  return (
    pos.x >= x &&
    pos.x <= x + width &&
    pos.y >= y &&
    pos.y <= y + height
  );
}

export function DnDSidebar() {
  const { onDragStart, isDragging } = useDnD();
  const [type, setType] = useState<string | null>(null);
  const { setNodes, getNodes } = useReactFlow();

  const createAddNewNode = useCallback(
    (
      nodeType: string,
      data: Record<string, boolean | string | number>
    ): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        console.log("getting");
        const allNodes = getNodes();
        const backgroundNodes = allNodes.filter((node) => node.type === 'bg');
        console.log("background nodes", backgroundNodes);

      const targetZone = backgroundNodes.find((node) =>
        isPositionInsideNode(position, node)
      );


      console.log('Target zone:', targetZone);

      if (!targetZone) {
        console.warn('Dropped outside any section. Node rejected.');
        return; // Drop outside of a zone, reject
      }

      const allowedTypes = allowedTypesPerSection[targetZone.id] ;
      if (!allowedTypes.includes(nodeType)) {
        console.warn(`Node type "${nodeType}" not allowed in zone "${targetZone.id}".`);
        return; // Drop into wrong zone, reject
      }

console.log("great success");
        const newNode = {
          id: getId(),
          type: nodeType,
          position,
          data: data,
        };

        setNodes((nds) => nds.concat(newNode));
        setType(null);
      };
    },
    [setNodes, setType, getNodes]
  );

  const createConnectorNode = useCallback(
    (isAnd: boolean): OnDropAction => {
      return createAddNewNode('connectorNode', { isAnd: isAnd });
    },
    [createAddNewNode]
  );

  return (
    <>
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
            id="preview-price-change"
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
          <EventWithinNodeUI id="preview-price-change" value={1} />
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
            id="preview-price-change"
            startDate={new Date()}
            endDate={new Date(7 * 24 * 60 * 60 * 1000 + Date.now())}
          />
        </div>
      </div>
    </>
  );
}
