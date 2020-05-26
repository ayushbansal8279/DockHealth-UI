import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from '../TaskItem/TaskItem';
import { DroppablePlaceholder } from './styled';

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
  reassignTask,
  isCompletedGroup,
  members,
  updateDueDate,
}) => {
  const [isDraggingOverGroup, setIsDraggingOverGroup] = useState(false);

  return (
    <Droppable droppableId={groupId} isDropDisabled={isCompletedGroup}>
      {(providedDroppable, snapshot) => {
        setIsDraggingOverGroup(snapshot?.isDraggingOver);
        return (
          <DroppablePlaceholder
            isDraggingOverGroup={isDraggingOverGroup}
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
                {(draggableProvided, { isDragging }) => (
                  <Task
                    key={task.taskIdentifier}
                    currentUser={currentUser}
                    isFullView={isFullView}
                    isDragging={isDragging}
                    isStartedDnD={draggedId === task.taskIdentifier}
                    openDrawer={openDrawer}
                    storeAsCurrentTask={storeAsCurrentTask}
                    toggleTaskPriority={toggleTaskPriority}
                    task={task}
                    groupId={groupId}
                    draggableProvided={draggableProvided}
                    taskListIdentifier={taskListIdentifier}
                    reorderSubtasksForTask={reorderSubtasksForTask}
                    isCompleted={isCompletedGroup}
                    isCompletedGroup={isCompletedGroup}
                    toggleCompleteTask={toggleCompleteTask}
                    members={members}
                    reassignTask={reassignTask}
                    updateDueDate={updateDueDate}
                  />
                )}
              </Draggable>
            ))}
            {providedDroppable.placeholder}
          </DroppablePlaceholder>
        );
      }}
    </Droppable>
  );
};

export default DragAndDropGroupList;
