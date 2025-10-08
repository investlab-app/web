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
import type { XYPosition } from '@xyflow/react';

let id = 0;
const getId = () => `dndnode_${id++}`;

export function DnDSidebar() {
  const { onDragStart, isDragging } = useDnD();
  const [type, setType] = useState<string | null>(null);
  const { setNodes } = useReactFlow();

  const createAddNewNode = useCallback(
    (
      nodeType: string,
      data: Record<string, boolean | string | number>
    ): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
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
    [setNodes, setType]
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
