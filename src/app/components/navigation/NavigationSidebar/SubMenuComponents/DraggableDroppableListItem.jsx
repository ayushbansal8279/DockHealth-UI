import React, { useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DraggableDroppableListItem = ({
  list,
  index,
  children,
  setDragActiveId,
  searchValue,
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
    disabled: !!searchValue,
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
    <div ref={dragDropRef} {...listeners} {...attributes} style={style}>
      {children}
    </div>
  );
};
export default DraggableDroppableListItem;
