/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useMemo, useRef } from 'react';
import { isEmpty, pluck } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import {
  userIdentifierSelector,
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
  getUserTaskCounters,
} from 'actions/person-details-actions';
import { onSortChanged } from 'helpers/ga-event-helper';
import EmptyTaskListFox from 'img/animals/fox.png';
import { getSharedTaskListsWithCurrentUser } from 'api/task-list-api';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';
import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';
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
import { changeTasksSelectedState } from 'actions/task-actions';
import { TaskGroupsContainer } from '../styled';

const PersonDetailsOpenedTasks = ({
  taskItemConfig,
  searchValue,
  toggleCompleteTask,
  onTaskUpdate,
  updateDueDate,
  updateWorkflowStatus,
}) => {
  const dispatch = useDispatch();

  const userIdentifier = useSelector(userIdentifierSelector);
  const isFetchingTasks = useSelector(tasksIsFetchingSelector);
  const tasks = useSelector(tasksSelector);
  const sort = useSelector(sortSelector);
  const areFiltersApplied = useSelector(hasFiltersAppliedSelector);
  const currentUser = useSelector(userProfileSelector);
  const addingNewSubtaskParentId = useSelector(
    addingNewSubtaskParentIdSelector,
  );

  const quickAddTaskInputReference = useRef(null);
  const filteredTasks = useMemo(
    () => (!searchValue ? tasks : filterTasksBySearchValue(tasks, searchValue)),
    [searchValue, tasks],
  );

  const handleQuickAddTask = task => {
    dispatch(
      openModal('ListPicker', {
        fetchMethod: () => getSharedTaskListsWithCurrentUser(userIdentifier),
        listCreationPayload: {
          adminIdentifiers:
            currentUser.userIdentifier !== userIdentifier
              ? [userIdentifier]
              : [],
        },
        confirm: taskListIdentifier => {
          const payload = {
            ...task,
            taskListIdentifier,
            assignedToIdentifier: userIdentifier,
            taskGroupIdentifier: null,
          };

          dispatch(quickAddTask(payload)).then(() => {
            dispatch(getUserTaskCounters(userIdentifier));
          });
        },
      }),
    );
  };

  const renderEmptyState = () => {
    if (searchValue) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    return (
      <EmptyListViewWithQuickAddTask quickAddTask={handleQuickAddTask}>
        <EmptyListView
          title="This person has no tasks"
          description="Add and automatically assign a task to this person above."
          image={EmptyTaskListFox}
        />
      </EmptyListViewWithQuickAddTask>
    );
  };

  const handleSortChange = (key, order) => {
    onSortChanged(order ? key : null, order);
    dispatch(sortUserTasks(key, order));
  };

  const isGroupSelected = useMemo(() => checkIfAllTasksSelected(tasks), [
    tasks,
  ]);

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
          {!isEmpty(filteredTasks) ? (
            <TaskListGroupCollapse group={{ groupName: 'All tasks' }}>
              {({ isFullView }) => (
                <>
                  <QuickAddTaskInput
                    ref={quickAddTaskInputReference}
                    quickAddTask={task => {
                      quickAddTask(task);
                      setTimeout(() => {
                        quickAddTaskInputReference.current.focus();
                      }, 0);
                    }}
                  />
                  <TasksHeader
                    bulkEditEnabled
                    sort={sort}
                    onSortChange={handleSortChange}
                    taskItemConfig={taskItemConfig}
                    groupHasMultipleAssignees
                    isGroupSelected={isGroupSelected}
                    onGroupSelect={handleGroupSelect}
                  />
                  {filteredTasks?.map(task => (
                    <StandardTaskItem
                      key={task.identifier}
                      isFullView={isFullView}
                      task={task}
                      taskGroupIdentifier={TASKGROUP_DEFAULT_TYPE}
                      isCompletedGroup={false}
                      toggleCompleteTask={toggleCompleteTask}
                      onTaskUpdate={onTaskUpdate}
                      updateDueDate={updateDueDate}
                      updateWorkflowStatus={updateWorkflowStatus}
                      addingNewSubtask={
                        addingNewSubtaskParentId === task.identifier
                      }
                      areFiltersApplied={areFiltersApplied}
                      isSearchApplied={searchValue}
                      multipleAssigneesContext
                      taskItemConfig={taskItemConfig}
                      dragAndDropDisabled
                    />
                  ))}
                </>
              )}
            </TaskListGroupCollapse>
          ) : (
            renderEmptyState()
          )}
        </TaskGroupsContainer>
      )}
    </BulkEditSection>
  );
};

export default PersonDetailsOpenedTasks;
