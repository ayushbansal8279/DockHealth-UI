import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Task from '../TaskItem/TaskItem';

const DragAndDropGroupList = ({
  groupId,
  currentUser,
  isFullView,
  isStartedDnD,
  markComplete,
  openDrawer,
  storeAsCurrentTask,
  toggleTaskPriority,
  taskListIdentifier,
  tasks,
  reorderSubtasksForTask,
}) => (
  <Droppable droppableId={groupId}>
    {providedDroppable => (
      <div
        ref={providedDroppable.innerRef}
        {...providedDroppable.droppableProps}
      >
        {tasks?.map((task, index) => (
          <Draggable
            key={task.taskId}
            draggableId={String(task.taskId)}
            index={index}
          >
            {(providedDraggalbe, { isDragging }) => (
              <>
                <Task
                  key={task.taskId}
                  currentUser={currentUser}
                  isFullView={isFullView}
                  isDragging={isDragging}
                  isStartedDnD={isStartedDnD}
                  markComplete={markComplete}
                  openDrawer={openDrawer}
                  storeAsCurrentTask={storeAsCurrentTask}
                  toggleTaskPriority={toggleTaskPriority}
                  task={task}
                  groupId={groupId}
                  dragandDropProps={providedDraggalbe}
                  taskListIdentifier={taskListIdentifier}
                  reorderSubtasksForTask={reorderSubtasksForTask}
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
