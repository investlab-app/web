import { useReactFlow } from '@xyflow/react';
import { useCallback, useState } from 'react';
import { useDnD } from '../hooks/use-dnd';
import { DragGhost } from './drag-ghost';
import { ConnectorNodeUI } from './nodes-ui/connector-node-ui';
import { PriceChangesNodeUI } from './nodes-ui/price-changes-node-ui';
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
      data: Record<string, boolean | string>
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
      <aside>
        <div>Logical Operators</div>
        <div
          onPointerDown={(event) => {
            setType('connectorNode');
            onDragStart(event, createConnectorNode(true));
          }}
        >
          <ConnectorNodeUI isAnd={true} id={"preview-and"} />
        </div>
        <div
          onPointerDown={(event) => {
            setType('and node');
            onDragStart(event, createConnectorNode(false));
          }}
        >
            <ConnectorNodeUI isAnd={false} id={"preview-and"} />
        </div>
        <div>Triggers</div>
        <div
          onPointerDown={(event) => {
            setType('priceChangesNode');
            onDragStart(
              event,
              createAddNewNode('priceChangesNode', {
                value: '',
                direction: 'rise',
              })
            );
          }}
        >
         <PriceChangesNodeUI id="preview-price-change" value="TICKER" direction='rises' />
        </div>
      </aside>
    </>
  );
}


