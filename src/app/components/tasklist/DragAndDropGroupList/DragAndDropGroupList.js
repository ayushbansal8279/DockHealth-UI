import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import { DroppablePlaceholder } from './styled';

const DragAndDropGroupList = ({
  groupId,
  currentUser,
  isFullView,
  toggleCompleteTask,
  draggedId,
  tasks,
  reorderSubtasksForTask,
  reassignTask,
  isCompletedGroup,
  updateDueDate,
  updateWorkflowStatus,
  dragAndDropDisabled,
  listNameVisible,
  selectedTask,
  subtasksDisabled,
  areFiltersApplied,
  isSearchApplied,
  shouldShowBlockModalOnDrag,
  showClearSortFiltersModal,
}) => {
  const [isDraggingOverGroup, setIsDraggingOverGroup] = useState(false);
  const {
    isTaskDrawerOpen,
    addingNewSubtask,
    addingNewSubtaskParentId,
    subtaskShape,
  } = useSelector(state => ({
    isTaskDrawerOpen: state.taskDrawerState.open,
    addingNewSubtask: state.taskState.addingNewSubtask,
    addingNewSubtaskParentId: state.taskState.addingNewSubtaskParentId,
    subtaskShape: state.taskState.subtaskShape,
  }));

  return (
    <Droppable
      droppableId={groupId}
      isDropDisabled={isCompletedGroup || shouldShowBlockModalOnDrag}
    >
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
                isDragDisabled={
                  isCompletedGroup || dragAndDropDisabled || isTaskDrawerOpen
                }
              >
                {(draggableProvided, { isDragging }) => (
                  <StandardTaskItem
                    key={task.taskIdentifier}
                    currentUser={currentUser}
                    isFullView={isFullView}
                    isDragging={isDragging}
                    isStartedDnD={draggedId === task.taskIdentifier}
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
                    isDraggable={!isTaskDrawerOpen}
                    addingNewSubtask={addingNewSubtask}
                    addingNewSubtaskParentId={addingNewSubtaskParentId}
                    subtaskShape={subtaskShape}
                    subtasksDisabled={subtasksDisabled}
                    areFiltersApplied={areFiltersApplied}
                    isSearchApplied={isSearchApplied}
                    shouldShowBlockModalOnDrag={shouldShowBlockModalOnDrag}
                    showClearSortFiltersModal={showClearSortFiltersModal}
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

export default React.memo(DragAndDropGroupList);
