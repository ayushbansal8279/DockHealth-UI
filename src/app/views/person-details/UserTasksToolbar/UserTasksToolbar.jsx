import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'ramda';
import { useHistory, useParams } from 'react-router-dom';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import { selectFiltersForMegaFilter } from 'actions/mega-filter-actions';
import { getUserTaskFilterOptions } from 'actions/person-details-actions';
import {
  userDetailsSelector,
  taskCountersSelector,
  tasksIsFetchingSelector,
  completedTasksIsFetchingSelector,
  tasksSelector,
  completedTasksSelector,
} from 'selectors/person-details-selectors';
import Toolbar from 'components/tasklist/Toolbar/Toolbar';
import { TaskListTabName } from 'helpers/tasklist-helpers';

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

const UserTasksToolbar = props => {
  const { selectedTab } = props;
  const { userIdentifier, tabName } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const userDetails = useSelector(userDetailsSelector);
  const taskCounters = useSelector(taskCountersSelector);
  const isFetching = useSelector(tasksIsFetchingSelector);
  const isCompletedTasksFetching = useSelector(
    completedTasksIsFetchingSelector,
  );
  const tasks = useSelector(tasksSelector);
  const completedTasks = useSelector(completedTasksSelector);
  const megaFilter = useSelector(megaFilterSelector);

  const { selectedFilters } = megaFilter || {};

  const haveTasks =
    (taskCounters.incomplete > 0 && selectedTab === TaskListTabName.OPEN) ||
    (taskCounters.complete > 0 && selectedTab === TaskListTabName.COMPLETE);

  const tasksAndSubTasksCount =
    selectedTab === TaskListTabName.OPEN
      ? determineTaskCounts({
          selectedFilters,
          isFetching,
          tasks,
          tasksCount: taskCounters.incomplete,
          status: 'INCOMPLETE',
        })
      : determineTaskCounts({
          selectedFilters,
          isFetching,
          tasks: completedTasks,
          tasksCount: taskCounters.complete,
          status: 'COMPLETE',
        });

  const handleSelectTab = tab => {
    history.push(
      `/core/assignedToPerson/${userIdentifier}${
        tab === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
    );
  };

  const handleFilterChange = updatedFilters => {
    const taskStatus =
      tabName?.toUpperCase() === TaskListTabName.COMPLETE
        ? 'COMPLETE'
        : 'INCOMPLETE';

    dispatch(
      selectFiltersForMegaFilter(updatedFilters, userIdentifier, taskStatus),
    );
  };

  const handleFilterOpen = () => {
    if (!selectedFilters || isEmpty(selectedFilters))
      dispatch(getUserTaskFilterOptions());
  };

  return (
    <Toolbar
      listNameColumnVisible
      showNotifications={false}
      showMembers={false}
      members={[userDetails]}
      pdfTitle={
        userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : null
      }
      openTasksAmount={taskCounters.incomplete}
      completedTasksAmount={taskCounters.complete}
      isFetching={isFetching || isCompletedTasksFetching}
      tasks={tasks}
      completedTasks={completedTasks}
      haveTasks={haveTasks}
      tasksAndSubTasksCount={tasksAndSubTasksCount}
      printData={{
        openedTasks: tasks,
        completedTasks,
        taskListMembers: [userDetails],
        showMembers: false,
      }}
      megaFilter={megaFilter}
      onSelectTab={handleSelectTab}
      onSelectFilters={handleFilterChange}
      onFilterOpen={handleFilterOpen}
      {...props}
    />
  );
};

export default UserTasksToolbar;
