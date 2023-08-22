import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import isEmpty from 'ramda/src/isEmpty';
import pluck from 'ramda/src/pluck';
import { useDispatch, useSelector } from 'react-redux';
import {
  tasksIsFetchingSelector,
  tasksSelector,
  sortSelector,
} from 'selectors/person-details-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import { addingNewSubtaskParentIdSelector } from 'selectors/task-drawer-selectors';
import { openModal } from 'modal/actions';
import {
  getUserTasks,
  sortUserTasks,
  quickAddTask,
} from 'actions/person-details-actions';
import { onSortChanged } from 'helpers/ga-event-helper';
import { getSharedTaskListsWithCurrentUser } from 'api/task-list-api';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListViewWithQuickAddTask from 'components/tasklist/EmptyListView/EmptyListViewWithQuickAddTask';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import TaskListGroupCollapse from 'views/patient-details/TaskListGroupCollapse/TaskListGroupCollapse';
import TasksHeader from 'components/tasklist/TasksHeader/TasksHeader';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import { TaskOrigin } from 'helpers/task-helpers';
import { changeTasksSelectedState } from 'actions/task-actions';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import { TaskGroupsContainer } from 'views/person-details/styled';

const CustomProfileDetailsOpenedTasks = ({
  profileIdentifier,
  taskItemConfig,
  searchValue,
  toggleCompleteTask,
  onTaskUpdate,
  updateWorkflowStatus,
  onOrderChange,
  iconColorActive,
}) => {
  const dispatch = useDispatch();
  const isFetchingTasks = useSelector(tasksIsFetchingSelector);
  const tasks = useSelector(tasksSelector);
  const sort = useSelector(sortSelector);
  const areFiltersApplied = useSelector(hasFiltersAppliedSelector);
  const currentUser = useSelector(userProfileSelector);
  const addingNewSubtaskParentId = useSelector(
    addingNewSubtaskParentIdSelector,
  );
  const { setViewSpecificConfig } = useTaskListColumnsConfig();
  const quickAddTaskInputReference = useRef(null);

  useEffect(() => {
    setViewSpecificConfig(taskItemConfig);
  }, [setViewSpecificConfig, taskItemConfig]);

  const handleQuickAddTask = (task) => {
    dispatch(
      openModal('ListPicker', {
        enableSelectingGroupStep: true,
        fetchMethod: () =>
          getSharedTaskListsWithCurrentUser(sessionStorage.userIdentifier),
        listCreationPayload: {
          adminIdentifiers:
            // eslint-disable-next-line unicorn/no-negated-condition
            currentUser.userIdentifier !== sessionStorage.userIdentifier
              ? [sessionStorage.userIdentifier]
              : [],
        },
        confirm: (taskListIdentifier, taskGroupIdentifier) => {
          const payload = {
            ...task,
            taskListIdentifier,
            assignedToIdentifier: profileIdentifier,
            taskGroupIdentifier,
          };

          dispatch(quickAddTask(payload)).then(() => {
            // dispatch(getUserTaskCounters(sessionStorage.userIdentifier));
          });
        },
      }),
    );
  };

  const renderEmptyState = () => {
    if (searchValue) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    return (
      <EmptyListViewWithQuickAddTask
        quickAddTask={handleQuickAddTask}
        iconColorActive={iconColorActive}
      >
        <EmptyListView
          title="This person has no tasks"
          description="Add and automatically assign a task to this person above."
        />
      </EmptyListViewWithQuickAddTask>
    );
  };

  const handleSortChange = (key, order) => {
    onSortChanged(order ? key : null, order);
    dispatch(sortUserTasks(key, order));
  };

  const isGroupSelected = useMemo(
    () => checkIfAllTasksSelected(tasks),
    [tasks],
  );

  const handleGroupSelect = useCallback(() => {
    const { parentTasks, subtasks } = extractTasksAndSubtasks(tasks);
    const allTasks = [...parentTasks, ...subtasks];
    dispatch(
      changeTasksSelectedState(!isGroupSelected, pluck('identifier', allTasks)),
    );
  }, [dispatch, isGroupSelected, tasks]);

  return (
    <BulkEditSection
      allTasks={tasks}
      refreshTasks={() => dispatch(getUserTasks())}
      searchValue={searchValue}
    >
      {isFetchingTasks && !tasks ? (
        <GroupedListSkeletonLoader numberOfGroups={1} />
      ) : (
        <TaskGroupsContainer>
          {isEmpty(tasks) ? (
            renderEmptyState()
          ) : (
            <TaskListGroupCollapse
              group={{ groupName: 'All tasks' }}
              stickyHeader
            >
              {({ isFullView }) => (
                <>
                  <StickyContainer left={24} decreaseWidth={2 * 24} zIndex={13}>
                    <QuickAddTaskInput
                      ref={quickAddTaskInputReference}
                      quickAddTask={(task) => {
                        handleQuickAddTask(task);
                        setTimeout(() => {
                          quickAddTaskInputReference.current.focus();
                        }, 0);
                      }}
                      iconColorActive={iconColorActive}
                    />
                  </StickyContainer>
                  <TasksHeader
                    onOrderChange={onOrderChange}
                    bulkEditEnabled
                    sort={sort}
                    onSortChange={handleSortChange}
                    groupHasMultipleAssignees
                    isGroupSelected={isGroupSelected}
                    onGroupSelect={handleGroupSelect}
                  />
                  {tasks?.map((task) => (
                    <StandardTaskItem
                      key={task.identifier}
                      isFullView={isFullView}
                      taskIdentifier={task.identifier}
                      isCompletedGroup={false}
                      toggleCompleteTask={toggleCompleteTask}
                      onTaskUpdate={onTaskUpdate}
                      updateWorkflowStatus={updateWorkflowStatus}
                      addingNewSubtask={
                        addingNewSubtaskParentId === task.identifier
                      }
                      areFiltersApplied={areFiltersApplied}
                      isSearchApplied={searchValue}
                      multipleAssigneesContext
                      dragAndDropDisabled
                      iconColorActive={iconColorActive}
                      origin={TaskOrigin.PERSON}
                    />
                  ))}
                </>
              )}
            </TaskListGroupCollapse>
          )}
        </TaskGroupsContainer>
      )}
    </BulkEditSection>
  );
};

export default CustomProfileDetailsOpenedTasks;
