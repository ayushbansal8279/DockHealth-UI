import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { selectFiltersForMegaFilter } from 'actions/mega-filter-actions';
import {
  userDetailsSelector,
  taskCountersSelector,
  tasksIsFetchingSelector,
  completedTasksIsFetchingSelector,
  tasksSelector,
  completedTasksSelector,
} from 'selectors/person-details-selectors';
import Toolbar from 'components/tasklist/Toolbar/ToolbarContainer';
import { TaskListTabName } from 'helpers/tasklist-helpers';

const UserTasksToolbar = props => {
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
      onSelectTab={handleSelectTab}
      onSelectFilters={handleFilterChange}
      {...props}
    />
  );
};

export default UserTasksToolbar;
