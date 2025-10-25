
import type { NodeSettings } from '../../nodes/node-settings';
import type { CustomNodeTypes } from '../../types/node-types-2';
import type { OnDropAction } from '../../utils/dnd-context';

export type Constructor<T> = new () => T;

type SidebarSectionChildren = {
  [K in CustomNodeTypes]?: {
    // Using ComponentType<any> here because the components have their own specific prop types
    // that we want to preserve while still allowing them to be used in this generic context
    component: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    settingsType: Constructor<NodeSettings>;
  };
};

interface SidebarSectionProps {
  title: string;
  children: SidebarSectionChildren;
  createNodeFunc: (
    nodeType: string,
    settings:  Constructor<NodeSettings>,
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
          ([type, { component: Component, settingsType}]) => (
            <div
              key={type}
              className="cursor-grab hover:bg-gray-50 rounded transition-colors"
              onPointerDown={(event) => {
                setGhostType();
                onDragStart(event, createNodeFunc(type, settingsType ));
              }}
            >
              <Component
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
