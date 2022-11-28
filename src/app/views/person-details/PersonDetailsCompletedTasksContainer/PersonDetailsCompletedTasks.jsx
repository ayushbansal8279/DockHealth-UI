import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onSortChanged } from 'helpers/ga-event-helper';
import { completedTasksIsFetchingMoreSelector } from 'selectors/list-details-selectors';
import {
  completedTasksIsFetchingSelector,
  completedTasksSelector,
  taskCountersSelector,
  sortSelector,
} from 'selectors/person-details-selectors';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import { sortUserTasks } from 'actions/person-details-actions';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import { TaskGroupsContainer } from '../styled';

const PersonDetailsCompletedTasks = ({
  storeAsCurrentTask,
  toggleCompleteTask,
  searchValue,
  onTaskUpdate,
  listUniqueKey,
  taskItemConfig,
  onOrderChange,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const isFetchingTasks = useSelector(completedTasksIsFetchingSelector);
  const tasks = useSelector(completedTasksSelector);
  const isFetchingMoreTasks = useSelector(completedTasksIsFetchingMoreSelector);
  const taskCounters = useSelector(taskCountersSelector);
  const sort = useSelector(sortSelector);
  const areFiltersApplied = useSelector(hasFiltersAppliedSelector);
  const { setViewSpecificConfig } = useTaskListColumnsConfig();

  useEffect(() => {
    setViewSpecificConfig(taskItemConfig);
  }, [setViewSpecificConfig, taskItemConfig]);

  const filteredTasks = useMemo(
    () => (!searchValue ? tasks : filterTasksBySearchValue(tasks, searchValue)),
    [searchValue, tasks],
  );

  const renderEmptyState = () => {
    if (searchValue) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    return (
      <EmptyListView title="There are no completed tasks" description="" />
    );
  };

  const tasksAndSubTasks =
    tasks?.reduce(
      (counter, task) =>
        counter +
        task.subtasks?.filter(x => x.status === 'COMPLETE').length +
        1,
      0,
    ) || 0;

  const handleSortChange = (key, order) => {
    onSortChanged(order ? key : null, order);
    dispatch(sortUserTasks(key, order));
  };

  return (
    <>
      {isFetchingTasks ? (
        <GroupedListSkeletonLoader numberOfGroups={1} />
      ) : (
        <>
          {filteredTasks?.length > 0 ? (
            <TaskGroupsContainer>
              <TasksGroup
                onOrderChange={onOrderChange}
                groupName="Completed"
                storeAsCurrentTask={storeAsCurrentTask}
                toggleCompleteTask={toggleCompleteTask}
                tasks={filteredTasks}
                isCompletedGroup
                hasMoreTasks={tasksAndSubTasks < taskCounters.complete}
                isFetchingMoreTasks={isFetchingMoreTasks}
                quickAddTaskVisible={false}
                listNameVisible
                onTaskUpdate={onTaskUpdate}
                areFiltersApplied={areFiltersApplied}
                isSearchApplied={searchValue}
                listUniqueKey={listUniqueKey}
                sort={sort}
                onSortChange={handleSortChange}
                disableBulkEdit
              >
                {({
                  isCompletedGroup,
                  isFullView,
                  addingNewSubtaskParentId,
                  groupHasMultipleAssignees,
                  isListFlattened,
                  highlightedTasksParentIdentifier,
                  highlightTasksOfTheSameParent,
                }) => (
                  <>
                    {tasks?.map(task => (
                      <StandardTaskItem
                        key={task.identifier}
                        isFullView={isFullView}
                        task={task}
                        isCompletedGroup={isCompletedGroup}
                        toggleCompleteTask={toggleCompleteTask}
                        onTaskUpdate={onTaskUpdate}
                        addingNewSubtask={
                          addingNewSubtaskParentId === task.identifier
                        }
                        subtasksDisabled={isListFlattened}
                        areFiltersApplied={areFiltersApplied}
                        isSearchApplied={searchValue}
                        multipleAssigneesContext={groupHasMultipleAssignees}
                        highlightedTasksParentIdentifier={
                          highlightedTasksParentIdentifier
                        }
                        highlightTasksOfTheSameParent={
                          highlightTasksOfTheSameParent
                        }
                        dragAndDropDisabled
                      />
                    ))}
                  </>
                )}
              </TasksGroup>
            </TaskGroupsContainer>
          ) : (
            renderEmptyState()
          )}
        </>
      )}
    </>
  );
};

export default PersonDetailsCompletedTasks;
