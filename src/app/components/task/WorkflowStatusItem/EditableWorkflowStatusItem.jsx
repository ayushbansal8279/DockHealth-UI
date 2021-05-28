import React from 'react';
import DragHandleIcon from 'img/drag-handle';
import {
  DeleteStatusIcon,
  StatusFlag,
  StatusItemContent,
  StatusItemWrapper,
  StatusNameInput,
  DragHandle,
} from './styled';

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();
    // eslint-disable-next-line no-unused-expressions
    event.target?.blur();
  }
}

const StatusItem = ({
  isEditing,
  status,
  dragHandleProps,
  disabled,
  colorBorder,
  onInputChange,
  onSave,
  onEditStart,
  onDelete,
}) => {
  const { identifier, name, color } = status || {};

  return (
    <StatusItemWrapper>
      <StatusItemContent editing={isEditing}>
        {dragHandleProps && (
          <DragHandle {...dragHandleProps}>
            <DragHandleIcon />
          </DragHandle>
        )}
        <StatusFlag border={colorBorder} color={color} />
        <StatusNameInput
          autoFocus={!identifier}
          value={name}
          disabled={disabled}
          onChange={onInputChange}
          onFocus={onEditStart}
          onBlur={onSave}
          onKeyPress={handleKeyPress}
          placeholder={!identifier ? 'New Label' : ''}
        />
        {!disabled && (
          <button type="button" onClick={onDelete}>
            <DeleteStatusIcon />
          </button>
        )}
      </StatusItemContent>
    </StatusItemWrapper>
  );
};

export default StatusItem;
