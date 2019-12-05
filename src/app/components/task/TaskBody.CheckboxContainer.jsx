import React from 'react';
import TaskCheckbox from './TaskCheckbox';

export default ({
  hideCheckbox,
  status,
  handleStatusChange,
  disabled,
  isSubtask,
  isParentComplete,
}) => {
  if (hideCheckbox) {
    return null;
  }

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        width: 54,
        minWidth: 54,
      }}
    >
      <TaskCheckbox
        checked={status === 'COMPLETE'}
        onChange={handleStatusChange}
        onClick={event => {
          event.stopPropagation();
        }}
        disabled={disabled || (isSubtask && isParentComplete)}
      />
    </div>
  );
};
