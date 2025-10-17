import type { CustomNodeTypes } from '../../types/node-types';
import type { OnDropAction } from '../../utils/dnd-context';

type SidebarSectionChildren = {
  [K in CustomNodeTypes]?: {
    // Using ComponentType<any> here because the components have their own specific prop types
    // that we want to preserve while still allowing them to be used in this generic context
    component: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    props: Record<string, boolean | string | number>;
  };
};

interface SidebarSectionProps {
  title: string;
  children: SidebarSectionChildren;
  createNodeFunc: (
    nodeType: string,
    data: Record<string, boolean | string | number>
  ) => OnDropAction;
  onDragStart: (
    event: React.PointerEvent<HTMLDivElement>,
    dropAction: OnDropAction
  ) => void;
  setGhostType: () => void;
}

export function SidebarSection({
  title,
  children,
  createNodeFunc,
  onDragStart,
  setGhostType,
}: SidebarSectionProps) {
  return (
    <div className="mb-4">
      <div className="font-medium mb-2">{title}</div>
      <div className="space-y-2">
        {Object.entries(children).map(
          ([type, { component: Component, props }]) => (
            <div
              key={type}
              className="cursor-grab hover:bg-gray-50 rounded transition-colors"
              onPointerDown={(event) => {
                setGhostType();
                onDragStart(event, createNodeFunc(type, props));
              }}
            >
              <Component
                {...props}
                nodeId={`preview-${type.toLowerCase()}`}
                preview={true}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
