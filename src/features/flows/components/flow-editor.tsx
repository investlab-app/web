import { useRef } from 'react';
import { ConnectorNode } from '../nodes/connector/connector-node';
import { EventWithinNode } from '../nodes/rule/trigger/event-within-node';
import { HappensBetweenNode } from '../nodes/rule/trigger/happens-between-node';
import { PriceChangesNode } from '../nodes/rule/trigger/price-changes-node';
import { CustomNodeTypes } from '../types/node-types';


import { DnDProvider } from '../utils/dnd-context';
import { FlowCanvas } from './flow-canvas';
import { DnDSidebar } from './dnd-sidebar';
import { ExecuteButton } from './execute-button';
import type { FlowCanvasConfig } from './flow-canvas';
import {  ReactFlowProvider, type Node,  type ReactFlowInstance, type XYPosition,  } from '@xyflow/react';

export function FlowsEditor() {
  const rfInstances = useRef<Record<string, ReactFlowInstance>>({});
  const addNodeFns = useRef<Record<string, (node: Node) => void>>({});
const screenToFlowFns = useRef<Record<string, (pos: XYPosition) => XYPosition>>({});

  const flows: Array<FlowCanvasConfig> = [
    {
      id: '1',
      nodeTypes: {
        [CustomNodeTypes.Connector]: ConnectorNode,
        [CustomNodeTypes.PriceChanges]: PriceChangesNode,
        [CustomNodeTypes.EventWithin]: EventWithinNode,
        [CustomNodeTypes.HappensBetween]: HappensBetweenNode,
      },
    },
    {
      id: '2',
      nodeTypes: {
        [CustomNodeTypes.Connector]: ConnectorNode,
      },
    },
    {
      id: '3',
      nodeTypes: { [CustomNodeTypes.Connector]: ConnectorNode },
    },
  ];

  const handleSave = () => {
    for (const [id, instance] of Object.entries(rfInstances.current)) {
      localStorage.setItem(`flow-${id}`, JSON.stringify(instance.toObject()));
    }
  };

  return (
    <DnDProvider>
        <div className="flex">

        
      <div className="flex w-full h-[500px] gap-4">
        {flows.map((flow) => (
          <FlowCanvas
            key={flow.id}
            {...flow}
            onInstanceReady={(id, instance) => {
              rfInstances.current[id] = instance;
              screenToFlowFns.current[id] = instance.screenToFlowPosition;
            }}
            onRegisterAddNode={(id, addFn) => {
              addNodeFns.current[id] = addFn;
            }}
          />
        ))}
      </div>

<ReactFlowProvider>

      <DnDSidebar
        flows={flows.map((flow) => ({
            id: flow.id,
            allowedTypes: Object.keys(flow.nodeTypes),
            addNode: (node: Node) => addNodeFns.current[flow.id](node),
            screenToFlowPosition: (pos) =>
                screenToFlowFns.current[flow.id](pos),
        }))}
        />


      <div className="mt-2">
        <ExecuteButton onExecute={handleSave} />
      </div>
        </ReactFlowProvider>
      </div>
    </DnDProvider>
  );
}
