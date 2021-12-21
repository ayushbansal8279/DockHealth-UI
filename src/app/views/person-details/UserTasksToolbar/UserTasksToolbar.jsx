import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  userDetailsSelector,
  taskCountersSelector,
  tasksSelector,
  completedTasksSelector,
} from 'selectors/person-details-selectors';
import Toolbar from 'components/tasklist/Toolbar/Toolbar';
import { TaskListTabName } from 'helpers/tasklist-helpers';

const UserTasksToolbar = props => {
  const { selectedTab } = props;
  const { userIdentifier } = useParams();
  const history = useHistory();

  const userDetails = useSelector(userDetailsSelector);
  const taskCounters = useSelector(taskCountersSelector);
  const tasks = useSelector(tasksSelector);
  const completedTasks = useSelector(completedTasksSelector);

  const haveTasks =
    (taskCounters.incomplete > 0 && selectedTab === TaskListTabName.OPEN) ||
    (taskCounters.complete > 0 && selectedTab === TaskListTabName.COMPLETE);

  const handleSelectTab = tab => {
    history.push(
      `/core/assignedToPerson/${userIdentifier}${
        tab === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
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
      tasks={tasks}
      completedTasks={completedTasks}
      haveTasks={haveTasks}
      printData={{
        openedTasks: tasks,
        completedTasks,
        taskListMembers: [userDetails],
        showMembers: false,
      }}
      onSelectTab={handleSelectTab}
      {...props}
    />
  );
};

export default UserTasksToolbar;
