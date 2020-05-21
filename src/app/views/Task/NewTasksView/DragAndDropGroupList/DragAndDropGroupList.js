import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Task from '../TaskItem/TaskItem';

const DragAndDropGroupList = ({
  groupId,
  currentUser,
  isFullView,
  toggleCompleteTask,
  draggedId,
  openDrawer,
  storeAsCurrentTask,
  toggleTaskPriority,
  taskListIdentifier,
  tasks,
  reorderSubtasksForTask,
  isCompletedGroup,
}) => (
  <Droppable droppableId={groupId} isDropDisabled={isCompletedGroup}>
    {providedDroppable => (
      <div
        ref={providedDroppable.innerRef}
        {...providedDroppable.droppableProps}
      >
        {tasks?.map((task, index) => (
          <Draggable
            key={task.taskIdentifier}
            draggableId={String(task.taskIdentifier)}
            index={index}
            isDragDisabled={isCompletedGroup}
          >
            {(providedDraggalbe, { isDragging }) => (
              <>
                <Task
                  key={task.taskId}
                  currentUser={currentUser}
                  isFullView={isFullView}
                  isDragging={isDragging}
                  isStartedDnD={draggedId === task.taskIdentifier}
                  toggleCompleteTask={toggleCompleteTask}
                  openDrawer={openDrawer}
                  storeAsCurrentTask={storeAsCurrentTask}
                  toggleTaskPriority={toggleTaskPriority}
                  task={task}
                  groupId={groupId}
                  dragandDropProps={providedDraggalbe}
                  taskListIdentifier={taskListIdentifier}
                  reorderSubtasksForTask={reorderSubtasksForTask}
                  isCompletedGroup={isCompletedGroup}
                />
                {providedDraggalbe.placeholder}
              </>
            )}
          </Draggable>
        ))}
        {providedDroppable.placeholder}
      </div>
    )}
  </Droppable>
);

export default DragAndDropGroupList;
