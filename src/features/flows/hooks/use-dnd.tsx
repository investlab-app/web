import { useCallback, useContext, useEffect, useState } from 'react';
import { DnDContext } from '../utils/dnd-context';
import type { OnDropAction } from '../utils/dnd-context';
import type { XYPosition } from '@xyflow/react';

export const useDnD = () => {

  const context = useContext(DnDContext);

  if (!context) {
    throw new Error('useDnD must be used within a DnDProvider');
  }

  const { isDragging, setIsDragging, setDropAction, dropAction } = context;

  // This callback will be returned by the `useDnD` hook, and can be used in your UI,
  // when you want to start dragging a node into the flow.
  // For example, this is used in the `Sidebar` component.
  const onDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>, onDrop: OnDropAction) => {
      event.preventDefault();
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
      setIsDragging(true);
      console.log('im being dragged');
      setDropAction(onDrop);
    },
    [setIsDragging, setDropAction]
  );

  const onDragEnd = useCallback(
    (event: PointerEvent) => {
      if (!isDragging) {
        setIsDragging(false);
        return;
      }

      (event.target as HTMLElement).releasePointerCapture(event.pointerId);

      // Use elementFromPoint to get the actual element under the pointer
      const elementUnderPointer = document.elementFromPoint(
        event.clientX,
        event.clientY
      );
      const canvasDiv =
        elementUnderPointer?.closest('.react-flow')?.parentElement;
      event.preventDefault();

const canvasId = canvasDiv?.id;
      if (canvasId) {
  const screenPos = { x: event.clientX, y: event.clientY };  
  dropAction?.({ position: screenPos, id: canvasId });
}

      setIsDragging(false);
    },
    [ setIsDragging, dropAction, isDragging]
  );

  // Add global touch event listeners
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('pointerup', onDragEnd);

    return () => {
      document.removeEventListener('pointerup', onDragEnd);
    };
  }, [onDragEnd, isDragging]);

  return {
    isDragging,
    onDragStart,
  };
};

export const useDnDPosition = () => {
  const [position, setPosition] = useState<XYPosition | undefined>(undefined);

  // By default, the pointer move event sets the position of the dragged element in the context.
  // This will be used to display the `DragGhost` component.
  const onDrag = useCallback((event: PointerEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
  }, []);

  useEffect(() => {
    document.addEventListener('pointermove', onDrag);
    return () => {
      document.removeEventListener('pointermove', onDrag);
    };
  }, [onDrag]);

  return { position };
};
