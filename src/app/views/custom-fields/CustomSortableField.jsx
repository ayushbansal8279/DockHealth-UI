import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CustomSortableFieldWrapper } from './styled';

const CustomSortableField = ({ itemId, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: itemId });

  const style = { transform: CSS.Translate.toString(transform), transition };

  if (typeof children === 'function')
    return (
      <CustomSortableFieldWrapper ref={setNodeRef} style={style}>
        {children({ dragHandleProps: { ...attributes, ...listeners } })}
      </CustomSortableFieldWrapper>
    );

  return (
    <CustomSortableFieldWrapper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      {children}
    </CustomSortableFieldWrapper>
  );
};

export default CustomSortableField;
