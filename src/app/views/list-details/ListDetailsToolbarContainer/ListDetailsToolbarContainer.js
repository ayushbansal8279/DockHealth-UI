import React from 'react';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import Toolbar from 'components/tasklist/Toolbar/NewToolbar';

const ListDetailsToolbarContainer = props => {
  const {
    members,
    showMembers,
    selectedTab,
    tasks: openedTasks,
    completedTasks,
    openTasksAmount,
    completedTasksAmount,
  } = props;

  const haveTasks =
    (openTasksAmount > 0 && selectedTab === TaskListTabName.OPEN) ||
    (completedTasksAmount > 0 && selectedTab === TaskListTabName.COMPLETE);

  return (
    <Toolbar
      printData={{
        openedTasks,
        completedTasks,
        taskListMembers: members,
        showMembers,
      }}
      haveTasks={haveTasks}
      {...props}
    />
  );
};

export default ListDetailsToolbarContainer;
