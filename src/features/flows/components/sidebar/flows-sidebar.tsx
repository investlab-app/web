import { memo } from 'react';
import { FlowHeader } from './flow-header';
import { SaveButton } from './save-button';
import { DnDSidebar } from './dnd-sidebar';
import type { Node, XYPosition } from '@xyflow/react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/features/shared/components/ui/sidebar';

interface FlowsSidebarProps {
  lastNodeId: number;
  addNode: (node: Node) => void;
  setNodeType: (type: string | null) => void;
  screenToFlowPosition: (pos: XYPosition) => XYPosition;
  onSave: () => void;
  onDelete: () => void;
  name: string;
  onNameChange: (newName: string) => void;
}

export const FlowsSidebar = memo(function FlowsSidebar({
  addNode,
  lastNodeId,
  screenToFlowPosition,
  onSave,
  setNodeType,
  onDelete,
  name,
  onNameChange,
}: FlowsSidebarProps) {
  return (
    console.log('Rendering FlowsSidebar'),
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      side="right"
      noBackground
      className="overflow-hidden p-3 mt-10 w-fit"
    >
      <SidebarHeader className="h-fit justify-center p-0 pr-3">
        <FlowHeader
          initialTitle={name}
          onDelete={onDelete}
          canRename={false}
          onNameChange={onNameChange}
        />
        <SaveButton onSave={onSave} />
      </SidebarHeader>
      <SidebarContent>
        <DnDSidebar
          startNodeId={lastNodeId + 1}
          addNode={addNode}
          screenToFlowPosition={screenToFlowPosition}
          setNodeType={setNodeType}
        />
      </SidebarContent>
    </Sidebar>
  );
});
