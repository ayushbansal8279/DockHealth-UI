import React from 'react';
import { useSelector } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { TaskItemType } from 'helpers/task-helpers';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
import { DroppablePlaceholder } from './styled';

const DragAndDropGroupList = ({
  taskGroupIdentifier,
  isFullView,
  toggleCompleteTask,
  draggedId,
  tasks,
  onTaskUpdate,
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
  groupHasMultipleAssignees,
  highlightedTasksParentIdenditifer,
  highlightTasksOfTheSameParent,
  taskItemConfig,
}) => {
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
      droppableId={taskGroupIdentifier}
      isDropDisabled={isCompletedGroup || shouldShowBlockModalOnDrag}
    >
      {(providedDroppable, snapshot) => {
        return (
          <DroppablePlaceholder
            isDraggingOverGroup={snapshot?.isDraggingOver}
            ref={providedDroppable.innerRef}
            {...providedDroppable.droppableProps}
          >
            {tasks?.map((task, index) =>
              task?.itemType === TaskItemType.TASK ? (
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
                      isFullView={isFullView}
                      isDragging={isDragging}
                      isStartedDnD={draggedId === task.taskIdentifier}
                      task={task}
                      taskGroupIdentifier={taskGroupIdentifier}
                      draggableProvided={draggableProvided}
                      isCompletedGroup={isCompletedGroup}
                      toggleCompleteTask={toggleCompleteTask}
                      onTaskUpdate={onTaskUpdate}
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
                      multipleAssigneesContext={groupHasMultipleAssignees}
                      highlightedTasksParentIdenditifer={
                        highlightedTasksParentIdenditifer
                      }
                      highlightTasksOfTheSameParent={
                        highlightTasksOfTheSameParent
                      }
                      taskItemConfig={taskItemConfig}
                    />
                  )}
                </Draggable>
              ) : (
                <Draggable
                  key={task.identifier}
                  draggableId={task.identifier}
                  index={index}
                  isDragDisabled={
                    isCompletedGroup || dragAndDropDisabled || isTaskDrawerOpen
                  }
                >
                  {draggableProvided => (
                    <TaskTemplateGroup
                      isStartedDnD={draggedId === task.identifier}
                      draggableProvided={draggableProvided}
                      templateGroup={task}
                      taskItemConfig={taskItemConfig}
                      groupHasMultipleAssignees={groupHasMultipleAssignees}
                      isFullView={isFullView}
                      dragAndDropDisabled={
                        isCompletedGroup || dragAndDropDisabled
                      }
                    />
                  )}
                </Draggable>
              ),
            )}
            {providedDroppable.placeholder}
          </DroppablePlaceholder>
        );
      }}
    </Droppable>
  );
};

export default React.memo(DragAndDropGroupList);
