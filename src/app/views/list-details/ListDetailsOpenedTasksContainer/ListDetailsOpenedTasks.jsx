/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { isEmpty } from 'ramda';
import EmptyTaskListAlpaca from 'img/animals/alpaca';
import EmptyTaskListBear from 'img/animals/bear';

import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import GroupNameSection from 'components/tasklist/GroupNameSection/GroupNameSection';
import messages from 'components/tasklist/AddGroupNameButton/messages';
import AddGroupNameButton from 'components/tasklist/AddGroupNameButton/AddGroupNameButton';
import EmptyTaskAddView from 'components/tasklist/EmptyTaskAddView/EmptyTaskAddView';
import { onDragEndTask } from 'components/tasklist/DragDrop.helpers';
import ListSkeletonLoader from 'components/tasklist/ListSkeletonLoader/ListSkeletonLoader';
import { TaskGroupsContainer } from '../styled';

const ListDetailsOpenedTasks = ({
  createTaskGroupList,
  currentUser,
  toggleCompleteTask,
  groupedTasks,
  groupList,
  toggleSingleTaskPriority,
  editGroupName,
  quickAddTask,
  deleteGroup,
  changeGroupsOrder,
  reorderTasksInGroup,
  reorderSubtasksForTask,
  reassignTasksToAnotherGroup,
  reassignTask,
  isFetchingData,
  updateDueDate,
  updateWorkflowStatus,
  isSearchApplied,
  areFiltersApplied,
  selectedTask,
  listUniqueKey,
  taskCounters,
  loadTasksForTaskGroup,
}) => {
  const [tasksGrouped, updateTaskGroups] = useState(groupedTasks);
  const [draggedId, setDraggableId] = useState(null);

  useEffect(() => {
    updateTaskGroups(groupedTasks);
  }, [groupedTasks]);

  const renderEmptyState = () => {
    if (isSearchApplied) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    if (quickAddTask) {
      return (
        <EmptyTaskAddView quickAddTask={quickAddTask}>
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
    eventBundle =>
      onDragEndTask({
        eventBundle,
        groupList,
        tasks: tasksGrouped?.tasks,
        reorderTasksInGroup,
        reassignTasksToAnotherGroup,
        updateTaskGroups,
        setDraggableId,
      }),
    [groupList, reassignTasksToAnotherGroup, reorderTasksInGroup, tasksGrouped],
  );

  const onBeforeCapture = useCallback(({ draggableId }) => {
    setDraggableId(draggableId);
  }, []);

  const onGroupNameClick = useCallback(
    groupName => createTaskGroupList(groupName),
    [createTaskGroupList],
  );

  const renderTasks = useCallback(
    () =>
      groupList?.map(
        ({ groupName, taskGroupIdentifier, groupType, metricValue }, i) => (
          <TasksGroup
            key={i}
            isDefaultGroup={groupType === TASKGROUP_DEFAULT_TYPE}
            groupId={taskGroupIdentifier}
            currentUser={currentUser}
            groupName={
              groupType !== TASKGROUP_DEFAULT_TYPE ? groupName : 'New tasks'
            }
            groupTaskCounts={metricValue}
            toggleTaskPriority={toggleSingleTaskPriority}
            editGroupName={editGroupName}
            quickAddTask={quickAddTask}
            deleteGroup={deleteGroup}
            moveGroupUp={() => changeGroupsOrder(i, i - 1)}
            moveGroupDown={() => changeGroupsOrder(i, i + 1)}
            changingGroupOrderDisabled={!changeGroupsOrder}
            isFirstGroup={i === 0}
            isLastGroup={i === groupList?.length - 1}
            tasks={
              tasksGrouped[
                groupType !== TASKGROUP_DEFAULT_TYPE
                  ? taskGroupIdentifier
                  : TASKGROUP_DEFAULT_TYPE
              ]?.tasks || []
            }
            isLoadingGroup={
              tasksGrouped[
                groupType !== TASKGROUP_DEFAULT_TYPE
                  ? taskGroupIdentifier
                  : TASKGROUP_DEFAULT_TYPE
              ]?.isLoadingGroup || false
            }
            taskGroupIdentifier={taskGroupIdentifier}
            reorderSubtasksForTask={reorderSubtasksForTask}
            reassignTask={reassignTask}
            draggedId={draggedId}
            toggleCompleteTask={toggleCompleteTask}
            updateDueDate={updateDueDate}
            updateWorkflowStatus={updateWorkflowStatus}
            isSearchApplied={isSearchApplied}
            selectedTask={selectedTask}
            listUniqueKey={listUniqueKey}
            areFiltersApplied={areFiltersApplied}
            groupPagination
            hasMoreTasks={
              tasksGrouped[
                groupType !== TASKGROUP_DEFAULT_TYPE
                  ? taskGroupIdentifier
                  : TASKGROUP_DEFAULT_TYPE
              ]?.hasMore || false
            }
            showMoreTasks={() => {
              loadTasksForTaskGroup({
                taskGroupIdentifier,
                pageNumber:
                  tasksGrouped[
                    groupType !== TASKGROUP_DEFAULT_TYPE
                      ? taskGroupIdentifier
                      : TASKGROUP_DEFAULT_TYPE
                  ]?.pageNumber || 0,
              });
            }}
          />
        ),
      ),
    [
      areFiltersApplied,
      changeGroupsOrder,
      currentUser,
      deleteGroup,
      draggedId,
      editGroupName,
      groupList,
      isSearchApplied,
      listUniqueKey,
      loadTasksForTaskGroup,
      quickAddTask,
      reassignTask,
      reorderSubtasksForTask,
      selectedTask,
      tasksGrouped,
      toggleCompleteTask,
      toggleSingleTaskPriority,
      updateDueDate,
      updateWorkflowStatus,
    ],
  );

  if (isFetchingData) return <ListSkeletonLoader />;

  return (
    <TaskGroupsContainer>
      {!isEmpty(groupedTasks) ? (
        <>
          <DragDropContext
            onBeforeCapture={onBeforeCapture}
            onDragEnd={onDragEnd}
          >
            {renderTasks()}
          </DragDropContext>
          {!!createTaskGroupList && !isSearchApplied && (
            <GroupNameSection
              onEnterClick={onGroupNameClick}
              placeholder={messages.placeholder}
              closeOnEnter
            >
              <AddGroupNameButton />
            </GroupNameSection>
          )}
        </>
      ) : (
        renderEmptyState()
      )}
    </TaskGroupsContainer>
  );
};

export default ListDetailsOpenedTasks;
