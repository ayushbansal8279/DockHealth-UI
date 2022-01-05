/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useCallback, useMemo, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { isEmpty } from 'ramda';
import EmptyTaskListAlpaca from 'img/animals/alpaca';
import EmptyTaskListBear from 'img/animals/bear';
import { openModal as openModalAction } from 'modal/actions';
import { onTaskOrderChanged } from 'helpers/ga-event-helper';
import {
  applyTaskTemplate,
  reorderTaskListGroups,
} from 'actions/list-details-actions';

import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import GroupNameSection from 'components/tasklist/GroupNameSection/GroupNameSection';
import messages from 'components/tasklist/AddGroupNameButton/messages';
import AddGroupNameButton from 'components/tasklist/AddGroupNameButton/AddGroupNameButton';
import EmptyTaskAddView from 'components/tasklist/EmptyTaskAddView/EmptyTaskAddView';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import { TaskItemType } from 'helpers/task-helpers';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import { TaskGroupsContainer, DroppablePlaceholder } from '../styled';

const ListDetailsOpenedTasks = ({
  createTaskGroupList,
  toggleCompleteTask,
  groupedTasks,
  groupList,
  quickAddTask,
  reorderTasksInGroup,
  reassignTasksToAnotherGroup,
  onTaskUpdate,
  isFetchingData,
  updateWorkflowStatus,
  isSearchApplied,
  areFiltersApplied,
  listUniqueKey,
  taskCounters,
  loadTasksForTaskGroup,
  taskListIdentifier,
  sort,
  onSortChange,
  resetSort,
  viewSetup,
}) => {
  const [draggedId, setDraggableId] = useState(null);
  const dispatch = useDispatch();

  const renderEmptyState = () => {
    if (isSearchApplied) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    if (quickAddTask) {
      return (
        <EmptyTaskAddView
          quickAddTask={quickAddTask}
          taskListIdentifier={taskListIdentifier}
        >
          {taskCounters?.complete > 0 ? (
            <EmptyListView
              title={['Way to go!', 'You’ve completed all of your tasks.']}
              description="Take a breather, tomorrow is a new day full of possibilities."
              image={EmptyTaskListAlpaca}
            />
          ) : (
            <EmptyListView
              title="This list has no tasks"
              description="Be the first to add a task to this list!"
              image={EmptyTaskListBear}
            />
          )}
        </EmptyTaskAddView>
      );
    }

    return (
      <EmptyListView
        title="This list has no tasks"
        description="Be the first to add a task to this list!"
        image={EmptyTaskListBear}
      />
    );
  };

  const onDragEnd = useCallback(
    ({ destination, source }) => {
      setDraggableId(null);
      onTaskOrderChanged();

      if (!destination) return;

      if (source?.droppableId === destination?.droppableId) {
        reorderTasksInGroup({ destination, source });
      } else {
        reassignTasksToAnotherGroup({ destination, source });
      }
    },
    [reassignTasksToAnotherGroup, reorderTasksInGroup],
  );

  const onBeforeCapture = useCallback(({ draggableId }) => {
    setDraggableId(draggableId);
  }, []);

  const onGroupNameClick = useCallback(
    groupName => createTaskGroupList(groupName),
    [createTaskGroupList],
  );

  const hasAnyTask = useMemo(() => {
    return Object.values(groupedTasks).some(({ tasks }) => tasks?.length > 0);
  }, [groupedTasks]);

  const { bulkEditIsActive } = useContext(BulkEditContext);

  const dragAndDropDisabled = bulkEditIsActive;

  const isSortApplied = !!sort?.key && !!sort?.order;

  const showClearSortFiltersModal = useCallback(() => {
    if (isSortApplied) {
      setDraggableId(null);
      dispatch(
        openModalAction('ClearSortFilters', {
          confirm: () => {
            resetSort();
          },
          closeOnConfirm: true,
        }),
      );
    }
  }, [isSortApplied, dispatch, resetSort]);

  const applyTemplate = useCallback(
    ({ taskTemplateIdentifier, taskGroupIdentifier }) =>
      dispatch(
        applyTaskTemplate({
          taskTemplateIdentifier,
          taskListIdentifier,
          taskGroupIdentifier,
        }),
      ),
    [dispatch, taskListIdentifier],
  );

  const renderTasks = useCallback(
    () =>
      groupList
        ?.filter(
          ({ taskGroupIdentifier }) =>
            (!isSearchApplied && !areFiltersApplied) ||
            groupedTasks[taskGroupIdentifier]?.tasks?.length > 0,
        )
        .map(({ groupName, taskGroupIdentifier, metricValue }, i) => (
          <TasksGroup
            key={taskGroupIdentifier}
            isDefaultGroup={groupName === 'DEFAULT'}
            groupName={groupName === 'DEFAULT' ? 'New tasks' : groupName}
            groupTaskCounts={metricValue}
            quickAddTask={quickAddTask}
            moveGroupUp={() => dispatch(reorderTaskListGroups(i, i - 1))}
            moveGroupDown={() => dispatch(reorderTaskListGroups(i, i + 1))}
            isFirstGroup={i === 0}
            isLastGroup={i === groupList?.length - 1}
            tasks={groupedTasks[taskGroupIdentifier]?.tasks || []}
            isLoadingGroup={
              groupedTasks[taskGroupIdentifier]?.isLoadingGroup || false
            }
            isFetchingMoreTasks={
              groupedTasks[taskGroupIdentifier]?.isFetchingMoreTasks || false
            }
            taskGroupIdentifier={taskGroupIdentifier}
            onTaskUpdate={onTaskUpdate}
            draggedId={draggedId}
            toggleCompleteTask={toggleCompleteTask}
            updateWorkflowStatus={updateWorkflowStatus}
            isSearchApplied={isSearchApplied}
            listUniqueKey={listUniqueKey}
            areFiltersApplied={areFiltersApplied}
            groupPagination
            hasMoreTasks={groupedTasks[taskGroupIdentifier]?.hasMore || false}
            showMoreTasks={() => {
              loadTasksForTaskGroup({
                taskGroupIdentifier,
                startPosition:
                  groupedTasks[taskGroupIdentifier]?.moreTasksIndex || 0,
                refresh: false,
              });
            }}
            onTaskGroupViewModeChange={viewMode => {
              loadTasksForTaskGroup({
                taskGroupIdentifier,
                startPosition: 0,
                viewMode,
                refresh: true,
              });
            }}
            taskListIdentifier={taskListIdentifier}
            sort={sort}
            onSortChange={onSortChange}
            applyTemplate={applyTemplate}
          >
            {({
              isLoadingGroup,
              isFetchingMoreTasks,
              isCompletedGroup,
              isFullView,
              tasks,
              addingNewSubtaskParentId,
              groupHasMultipleAssignees,
              isListFlattened,
              highlightedTasksParentIdentifier,
              highlightTasksOfTheSameParent,
              groupPagination,
              hasMoreTasks,
              showMoreTasks,
            }) => (
              <>
                {(!isLoadingGroup || isFetchingMoreTasks) && (
                  <Droppable
                    droppableId={taskGroupIdentifier}
                    isDropDisabled={isCompletedGroup || isSortApplied}
                  >
                    {(providedDroppable, snapshot) => {
                      return (
                        <DroppablePlaceholder
                          isDraggingOverGroup={snapshot?.isDraggingOver}
                          ref={providedDroppable.innerRef}
                          {...providedDroppable.droppableProps}
                        >
                          {tasks?.map((task, index) => (
                            <Draggable
                              key={task.identifier}
                              draggableId={String(task.identifier)}
                              index={index}
                              isDragDisabled={
                                isCompletedGroup || dragAndDropDisabled
                              }
                            >
                              {(draggableProvided, { isDragging }) => (
                                <>
                                  {task?.itemType === TaskItemType.TASK ? (
                                    <StandardTaskItem
                                      key={task.identifier}
                                      isFullView={isFullView}
                                      isDragging={isDragging}
                                      isStartedDnD={
                                        draggedId === task.taskIdentifier
                                      }
                                      task={task}
                                      taskGroupIdentifier={taskGroupIdentifier}
                                      draggableProvided={draggableProvided}
                                      isCompletedGroup={isCompletedGroup}
                                      toggleCompleteTask={toggleCompleteTask}
                                      onTaskUpdate={onTaskUpdate}
                                      updateWorkflowStatus={
                                        updateWorkflowStatus
                                      }
                                      dragAndDropDisabled={
                                        isCompletedGroup || dragAndDropDisabled
                                      }
                                      isDraggable
                                      addingNewSubtask={
                                        addingNewSubtaskParentId ===
                                        task.identifier
                                      }
                                      subtasksDisabled={isListFlattened}
                                      areFiltersApplied={areFiltersApplied}
                                      isSearchApplied={isSearchApplied}
                                      shouldShowBlockModalOnDrag={isSortApplied}
                                      showClearSortFiltersModal={
                                        showClearSortFiltersModal
                                      }
                                      multipleAssigneesContext={
                                        groupHasMultipleAssignees
                                      }
                                      highlightedTasksParentIdentifier={
                                        highlightedTasksParentIdentifier
                                      }
                                      highlightTasksOfTheSameParent={
                                        highlightTasksOfTheSameParent
                                      }
                                    />
                                  ) : (
                                    <TaskTemplateGroup
                                      viewSetup={viewSetup}
                                      isStartedDnD={
                                        draggedId === task.identifier
                                      }
                                      draggableProvided={draggableProvided}
                                      templateGroup={task}
                                      groupHasMultipleAssignees={
                                        groupHasMultipleAssignees
                                      }
                                      isFullView={isFullView}
                                      dragAndDropDisabled={
                                        isCompletedGroup || dragAndDropDisabled
                                      }
                                    />
                                  )}
                                </>
                              )}
                            </Draggable>
                          ))}
                          {providedDroppable.placeholder}
                        </DroppablePlaceholder>
                      );
                    }}
                  </Droppable>
                )}
                {(isLoadingGroup || isFetchingMoreTasks) && (
                  <TasksSkeletonLoader rows={4} />
                )}
                {groupPagination && hasMoreTasks && !areFiltersApplied && (
                  <LoadMoreSection>
                    {!isLoadingGroup && (
                      <LoadMoreButton onClick={showMoreTasks} />
                    )}
                  </LoadMoreSection>
                )}
              </>
            )}
          </TasksGroup>
        )),
    [
      groupList,
      isSearchApplied,
      areFiltersApplied,
      groupedTasks,
      quickAddTask,
      onTaskUpdate,
      draggedId,
      toggleCompleteTask,
      updateWorkflowStatus,
      listUniqueKey,
      taskListIdentifier,
      sort,
      onSortChange,
      applyTemplate,
      loadTasksForTaskGroup,
      isSortApplied,
      dragAndDropDisabled,
      showClearSortFiltersModal,
      viewSetup,
      dispatch,
    ],
  );

  if (isFetchingData) return <GroupedListSkeletonLoader />;

  return (
    <TaskGroupsContainer>
      {isEmpty(groupedTasks) || (isSearchApplied && !hasAnyTask) ? (
        renderEmptyState()
      ) : (
        <>
          <DragDropContext
            onBeforeCapture={onBeforeCapture}
            onBeforeDragStart={showClearSortFiltersModal}
            onDragEnd={!isSortApplied ? onDragEnd : () => {}}
          >
            <div style={{ width: 'fit-content' }}>
              {renderTasks()}
              {!!createTaskGroupList && !isSearchApplied && !areFiltersApplied && (
                <GroupNameSection
                  onEnterClick={onGroupNameClick}
                  placeholder={messages.placeholder}
                  closeOnEnter
                >
                  <AddGroupNameButton />
                </GroupNameSection>
              )}
            </div>
          </DragDropContext>
        </>
      )}
    </TaskGroupsContainer>
  );
};

export default ListDetailsOpenedTasks;
