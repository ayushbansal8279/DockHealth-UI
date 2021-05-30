import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableItemWrapper } from './styled';

const SortableStatusItem = ({ itemId, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: itemId,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (typeof children === 'function') {
    return (
      <SortableItemWrapper ref={setNodeRef} style={style}>
        {children({ dragHandleProps: { ...attributes, ...listeners } })}
      </SortableItemWrapper>
    );
  }

  return (
    <SortableItemWrapper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      {children}
    </SortableItemWrapper>
  );
};

export default SortableStatusItem;
