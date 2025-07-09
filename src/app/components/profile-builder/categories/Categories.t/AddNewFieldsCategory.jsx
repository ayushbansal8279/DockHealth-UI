import React from 'react';
import { CategoryLabel, SingleField } from './styled';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const AddNewFieldsCategory = ({
  item,
  fieldTypeImages,
  isTrauncated,
  overlayWidth,
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: item.fieldType,
    data: {
      type: 'add-fields-area-source',
      item,
      fieldTypeImages,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    Position: 'reactive',
    zIndex: isDragging ? 9999 : 'auto',
    cursor: isDragging ? 'grabbibg' : 'grab',
  };

  if (isDragging) {
    return (
      <SingleField
        data-drag-id={item.fieldType}
        ref={setNodeRef}
        style={{
          ...style,
          opacity: 0,
          width: overlayWidth ? `${overlayWidth}px` : undefined,
        }}
        {...attributes}
        {...listeners}
      >
        <img
          style={{ width: 20 }}
          src={fieldTypeImages[item?.fieldType]}
          alt={item.name}
        />
        <CategoryLabel>{item.placeholder}</CategoryLabel>
      </SingleField>
    );
  }
  return (
    <SingleField
      data-drag-id={item.fieldType}
      ref={setNodeRef}
      style={{
        ...style,
        width: overlayWidth ? `${overlayWidth}px` : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      <img
        style={{ width: 20 }}
        src={fieldTypeImages[item?.fieldType]}
        alt={item.name}
      />
      {isTrauncated ? (
        <Tooltip placement="top" title={item.placeholder}>
          <CategoryLabel>{item.placeholder}</CategoryLabel>
        </Tooltip>
      ) : (
        <CategoryLabel>{item.placeholder}</CategoryLabel>
      )}
    </SingleField>
  );
};

export default AddNewFieldsCategory;
