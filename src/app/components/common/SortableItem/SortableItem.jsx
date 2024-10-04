import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';

const SortableItemWrapper = styled.div`
  width: 100%;
`;

const SortableItem = ({ itemId, children, overflowHidden = false, statusSection = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: itemId,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    overflow: overflowHidden ? 'hidden' : 'visible',
    width: statusSection ? '8rem' : '100%'
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

export default SortableItem;
