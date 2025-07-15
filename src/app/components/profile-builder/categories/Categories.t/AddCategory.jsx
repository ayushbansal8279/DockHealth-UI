import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { AddCategoryWrapper } from './styled';

const AddCategory = () => {
  const { setNodeRef: addCategoryDropRef } = useDroppable({
    id: 'add-category-area-source',
  });
  const {
    setNodeRef: addCategoryDragRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useDraggable({
    id: 'add-category-area-source',
    data: { type: 'add-category-area-source' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    zIndex: isDragging ? 9999 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  if (isDragging) {
    return (
      <div
        ref={(node) => {
          addCategoryDropRef(node);
          addCategoryDragRef(node);
        }}
      >
        <AddCategoryWrapper style={{ ...style, opacity: 0 }}>
          Add Category
        </AddCategoryWrapper>
      </div>
    );
  }

  return (
    <div
      ref={(node) => {
        addCategoryDropRef(node);
        addCategoryDragRef(node);
      }}
    >
      <AddCategoryWrapper {...attributes} {...listeners} style={style}>
        Add Category
      </AddCategoryWrapper>
    </div>
  );
};

export default AddCategory;
