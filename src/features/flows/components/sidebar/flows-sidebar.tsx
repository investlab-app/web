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
  addNode: (node: Node) => void;
  setNodeType: (type: string | null) => void;
  screenToFlowPosition: (pos: XYPosition) => XYPosition;
  onSave: () => void;
}

export const FlowsSidebar = memo(function FlowsSidebar({
  addNode,
  screenToFlowPosition,
  onSave,
  setNodeType,
}: FlowsSidebarProps) {
  console.log('sidebar rendering');
  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      side="right"
      noBackground
      className="overflow-hidden p-3 mt-10 w-fit"
    >
      <SidebarHeader className="h-fit justify-center p-0 pr-3">
        <FlowHeader
          initialTitle="My Trading 1"
          onSave={(newTitle) => {
            console.log('Saving new title:', newTitle);
          }}
          onDelete={() => {
            console.log('Deleting flow');
          }}
        />
        <SaveButton onSave={onSave} />
      </SidebarHeader>
      <SidebarContent>
        <DnDSidebar
          addNode={addNode}
          screenToFlowPosition={screenToFlowPosition}
          setNodeType={setNodeType}
        />
      </SidebarContent>
    </Sidebar>
  );
});
