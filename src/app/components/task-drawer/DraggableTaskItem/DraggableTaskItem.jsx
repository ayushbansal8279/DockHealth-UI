import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DrawerTask from '../../drawer-common/DrawerTask/DrawerTask';

const DraggableTaskItem = ({
  task,
  taskRestrictions,
  taskListRestrictions,
  currentUser,
  isDragDisabled,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task?.taskIdentifier, disabled: isDragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : undefined,
    position: isDragging ? 'relative' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DrawerTask
        key={task.taskIdentifier}
        task={task}
        taskRestrictions={taskRestrictions}
        taskListRestrictions={taskListRestrictions}
        currentUser={currentUser}
        dragListeners={listeners}
        dragAttributes={attributes}
        isDraggable={!isDragDisabled}
        isDragging={isDragging}
      />
    </div>
  );
};

export default DraggableTaskItem;
