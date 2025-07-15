import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CategoryLabel, SingleField } from './styled';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import { CSS } from '@dnd-kit/utilities';

const AddExistingFieldsCategory = ({
  item,
  fieldTypeImages,
  isTrauncated,
  index,
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
    id: item.identifier + `#${index}`,
    data: {
      type: 'add-existing-fields-area-source',
      item,
      fieldTypeImages,
      index,
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
        data-drag-id={item.identifier + `#${index}`}
        ref={setNodeRef}
        style={{
          ...style,
          opacity: 0,
          width: overlayWidth ? `${overlayWidth}px` : undefined,
        }}
        {...attributes}
        {...listeners}
      >
        <div>
          <img
            style={{ width: 15 }}
            src={fieldTypeImages[item?.fieldType]}
            alt={item.name}
          />
        </div>
        <CategoryLabel>{item.name}</CategoryLabel>
      </SingleField>
    );
  }

  return (
    <SingleField
      data-drag-id={item.identifier + `#${index}`}
      ref={setNodeRef}
      style={{
        ...style,
        width: overlayWidth ? `${overlayWidth}px` : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      <div>
        <img
          style={{ width: 15 }}
          src={fieldTypeImages[item?.fieldType]}
          alt={item.name}
        />
      </div>
      {isTrauncated ? (
        <Tooltip placement="top" title={item.name}>
          <CategoryLabel>{item.name}</CategoryLabel>
        </Tooltip>
      ) : (
        <CategoryLabel>{item.name}</CategoryLabel>
      )}
    </SingleField>
  );
};
export default AddExistingFieldsCategory;
