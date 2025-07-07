import React, { useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LongPressWrapper from '@/app/components/interaction/LongPressWrapper';

const DraggableDroppableListItem = ({
  list,
  index,
  children,
  setDragActiveId,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: dragDropRef,
    transform,
    transition,
    isDragging,
    active,
  } = useSortable({
    id: list?.taskListIdentifier,
    data: { index },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    zIndex: isDragging ? 9999 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  useEffect(() => {
    setDragActiveId(active ? active?.id : null);
  }, [setDragActiveId, active]);

  return (
    <LongPressWrapper onLongPress={listeners.onPointerDown}>
      <div ref={dragDropRef} {...attributes} style={style}>
        {children}
      </div>
    </LongPressWrapper>
  );
};
export default DraggableDroppableListItem;
