import { memo } from 'react';
import { RepetitionToggle } from '../repetition-toggle';
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
  repeat: boolean;
  onToggleRepeat: (repeat: boolean) => void;
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
  repeat,
  onToggleRepeat,
  name,
  onNameChange,
}: FlowsSidebarProps) {
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
          initialTitle={name}
          onDelete={onDelete}
          canRename={false}
          onNameChange={onNameChange}
        />
        <RepetitionToggle
          repeat={repeat}
          onToggle={onToggleRepeat}
          className="w-full"
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
