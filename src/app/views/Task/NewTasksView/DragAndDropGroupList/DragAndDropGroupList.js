import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from 'components/task-item/StandardTaskItem/TaskItem';
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
  tasks,
  reorderSubtasksForTask,
  reassignTask,
  isCompletedGroup,
  updateDueDate,
  updateWorkflowStatus,
  dragAndDropDisabled,
  listNameVisible,
  selectedTask,
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
                isDragDisabled={isCompletedGroup || dragAndDropDisabled}
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
                    reorderSubtasksForTask={reorderSubtasksForTask}
                    isCompletedGroup={isCompletedGroup}
                    toggleCompleteTask={toggleCompleteTask}
                    reassignTask={reassignTask}
                    updateDueDate={updateDueDate}
                    updateWorkflowStatus={updateWorkflowStatus}
                    dragAndDropDisabled={
                      isCompletedGroup || dragAndDropDisabled
                    }
                    listNameVisible={listNameVisible}
                    selectedTask={selectedTask}
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
