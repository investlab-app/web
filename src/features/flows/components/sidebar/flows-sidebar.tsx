import { SaveButton } from "./save-button";
import { DnDSidebar } from "./dnd-sidebar";
import type { Node, XYPosition } from "@xyflow/react";
import { Sidebar, SidebarContent, SidebarHeader } from "@/features/shared/components/ui/sidebar";

interface FlowsSidebarProps {
  addNode: (node: Node) => void;
  setNodeType: (type: string|null) => void;
  screenToFlowPosition: (pos: XYPosition) => XYPosition;
  onSave: () => void;
}


export function FlowsSidebar({addNode, screenToFlowPosition, onSave, setNodeType} : FlowsSidebarProps)  {
return (
<Sidebar variant="sidebar" collapsible="offcanvas" side="right" className="overflow-hidden p-4">
  <div className="h-10 bg-transparent">
</div>
      <SidebarHeader className="h-(--header-height) justify-center bg-transparent">
        <SaveButton onSave={onSave} />
      </SidebarHeader>
      <SidebarContent className="bg-transparent">
        <DnDSidebar addNode={addNode} screenToFlowPosition={screenToFlowPosition} setNodeType={setNodeType}/>
      </SidebarContent>
    </Sidebar>
);
}