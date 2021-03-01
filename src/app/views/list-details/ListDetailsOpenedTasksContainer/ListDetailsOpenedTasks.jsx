/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { useDispatch } from 'react-redux';

import { DragDropContext } from 'react-beautiful-dnd';
import { isEmpty } from 'ramda';
import EmptyTaskListAlpaca from 'img/animals/alpaca';
import EmptyTaskListBear from 'img/animals/bear';
import { openModal as openModalAction } from 'modal/actions';

import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import GroupNameSection from 'components/tasklist/GroupNameSection/GroupNameSection';
import messages from 'components/tasklist/AddGroupNameButton/messages';
import AddGroupNameButton from 'components/tasklist/AddGroupNameButton/AddGroupNameButton';
import EmptyTaskAddView from 'components/tasklist/EmptyTaskAddView/EmptyTaskAddView';
import { onDragEndTask } from 'components/tasklist/DragDrop.helpers';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import { TaskGroupsContainer } from '../styled';

const ListDetailsOpenedTasks = ({
  createTaskGroupList,
  toggleCompleteTask,
  groupedTasks,
  groupList,
  editGroupName,
  quickAddTask,
  deleteGroup,
  changeGroupsOrder,
  reorderTasksInGroup,
  reorderSubtasksForTask,
  reassignTasksToAnotherGroup,
  onTaskUpdate,
  isFetchingData,
  updateDueDate,
  updateWorkflowStatus,
  isSearchApplied,
  areFiltersApplied,
  selectedTask,
  listUniqueKey,
  taskCounters,
  loadTasksForTaskGroup,
  taskListIdentifier,
  sort,
  onSortChange,
  resetSort,
}) => {
  const [tasksGrouped, updateTaskGroups] = useState(groupedTasks);
  const [draggedId, setDraggableId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    updateTaskGroups(groupedTasks);
  }, [groupedTasks]);

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
    eventBundle =>
      onDragEndTask({
        eventBundle,
        groupList,
        tasks: tasksGrouped,
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

  const hasAnyTask = useMemo(() => {
    return Object.values(tasksGrouped).some(({ tasks }) => tasks?.length > 0);
  }, [tasksGrouped]);

  const { bulkEditIsActive } = useContext(BulkEditContext);

  const dragAndDropDisabled = bulkEditIsActive;

  const isSortApplied = !!sort?.key && !!sort?.order;

  const showClearSortFiltersModal = useCallback(() => {
    if (isSortApplied) {
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

  const renderTasks = useCallback(
    () =>
      groupList
        ?.filter(
          ({ taskGroupIdentifier }) =>
            (!isSearchApplied && !areFiltersApplied) ||
            tasksGrouped[taskGroupIdentifier]?.tasks?.length > 0,
        )
        .map(({ groupName, taskGroupIdentifier, metricValue }, i) => (
          <TasksGroup
            key={i}
            dragAndDropDisabled={dragAndDropDisabled}
            isDefaultGroup={groupName === 'DEFAULT'}
            groupId={taskGroupIdentifier}
            groupName={groupName === 'DEFAULT' ? 'New tasks' : groupName}
            groupTaskCounts={metricValue}
            editGroupName={editGroupName}
            quickAddTask={quickAddTask}
            deleteGroup={deleteGroup}
            moveGroupUp={() => changeGroupsOrder(i, i - 1)}
            moveGroupDown={() => changeGroupsOrder(i, i + 1)}
            changingGroupOrderDisabled={!changeGroupsOrder}
            isFirstGroup={i === 0}
            isLastGroup={i === groupList?.length - 1}
            tasks={tasksGrouped[taskGroupIdentifier]?.tasks || []}
            isLoadingGroup={
              tasksGrouped[taskGroupIdentifier]?.isLoadingGroup || false
            }
            isFetchingMoreTasks={
              tasksGrouped[taskGroupIdentifier]?.isFetchingMoreTasks || false
            }
            taskGroupIdentifier={taskGroupIdentifier}
            reorderSubtasksForTask={reorderSubtasksForTask}
            onTaskUpdate={onTaskUpdate}
            draggedId={draggedId}
            toggleCompleteTask={toggleCompleteTask}
            updateDueDate={updateDueDate}
            updateWorkflowStatus={updateWorkflowStatus}
            isSearchApplied={isSearchApplied}
            selectedTask={selectedTask}
            listUniqueKey={listUniqueKey}
            areFiltersApplied={areFiltersApplied}
            groupPagination
            hasMoreTasks={tasksGrouped[taskGroupIdentifier]?.hasMore || false}
            showMoreTasks={() => {
              loadTasksForTaskGroup({
                taskGroupIdentifier,
                startPosition:
                  tasksGrouped[taskGroupIdentifier]?.tasks?.length || 0,
                sort,
                refresh: false,
              });
            }}
            onTaskGroupViewModeChange={viewMode => {
              loadTasksForTaskGroup({
                taskGroupIdentifier,
                startPosition: 0,
                sort,
                viewMode,
                refresh: true,
              });
            }}
            taskListIdentifier={taskListIdentifier}
            sort={sort}
            onSortChange={onSortChange}
            shouldShowBlockModalOnDrag={isSortApplied}
            showClearSortFiltersModal={showClearSortFiltersModal}
          />
        )),
    [
      groupList,
      isSearchApplied,
      areFiltersApplied,
      tasksGrouped,
      dragAndDropDisabled,
      editGroupName,
      quickAddTask,
      deleteGroup,
      changeGroupsOrder,
      reorderSubtasksForTask,
      onTaskUpdate,
      draggedId,
      toggleCompleteTask,
      updateDueDate,
      updateWorkflowStatus,
      selectedTask,
      listUniqueKey,
      taskListIdentifier,
      sort,
      onSortChange,
      isSortApplied,
      showClearSortFiltersModal,
      loadTasksForTaskGroup,
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
            {renderTasks()}
          </DragDropContext>
          {!!createTaskGroupList && !isSearchApplied && !areFiltersApplied && (
            <GroupNameSection
              onEnterClick={onGroupNameClick}
              placeholder={messages.placeholder}
              closeOnEnter
            >
              <AddGroupNameButton />
            </GroupNameSection>
          )}
        </>
      )}
    </TaskGroupsContainer>
  );
};

export default ListDetailsOpenedTasks;
