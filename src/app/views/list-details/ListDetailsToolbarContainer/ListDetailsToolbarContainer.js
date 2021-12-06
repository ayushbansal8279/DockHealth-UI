/* eslint-disable unicorn/no-nested-ternary */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import { isEmpty } from 'ramda';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import Toolbar from 'components/tasklist/Toolbar/Toolbar';
import { getCurrentTaskListFilterOptions } from 'actions/task-list-actions';

const determineTaskCounts = ({
  selectedFilters,
  isFetching,
  tasks,
  tasksCount,
  status,
}) => {
  return selectedFilters && !isEmpty(selectedFilters) && !isFetching
    ? tasks?.reduce(
        (counter, task) =>
          counter + task.subtasks?.filter(x => x.status === status).length + 1,
        0,
      ) || 0
    : tasksCount;
};

const ListDetailsToolbarContainer = props => {
  const {
    members,
    selectedTab,
    showMembers,
    tasks: openedTasks,
    completedTasks,
    openTasksAmount,
    completedTasksAmount,
    isFetching,
  } = props;

  const dispatch = useDispatch();
  const megaFilter = useSelector(megaFilterSelector);

  const { selectedFilters } = megaFilter || {};

  const haveTasks =
    (openTasksAmount > 0 && selectedTab === TaskListTabName.OPEN) ||
    (completedTasksAmount > 0 && selectedTab === TaskListTabName.COMPLETE);

  const tasksAndSubTasksCount =
    selectedTab === TaskListTabName.OPEN
      ? determineTaskCounts({
          selectedFilters,
          isFetching,
          tasks: openedTasks,
          tasksCount: openTasksAmount,
          status: 'INCOMPLETE',
        })
      : determineTaskCounts({
          selectedFilters,
          isFetching,
          tasks: completedTasks,
          tasksCount: completedTasksAmount,
          status: 'COMPLETE',
        });

  const handleFilterOpen = () => {
    if (!selectedFilters || isEmpty(selectedFilters)) {
      dispatch(getCurrentTaskListFilterOptions());
    }
  };

  return (
    <Toolbar
      printData={{
        openedTasks,
        completedTasks,
        taskListMembers: members,
        showMembers,
      }}
      megaFilter={megaFilter}
      haveTasks={haveTasks}
      tasksAndSubTasksCount={tasksAndSubTasksCount}
      onFilterOpen={handleFilterOpen}
      {...props}
    />
  );
};

export default ListDetailsToolbarContainer;
