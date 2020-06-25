import React from 'react';
import SlimTaskItem from 'components/task-item/SlimTaskItem/SlimTaskItem';
import {
  DashboardTasksGroupContainer,
  DashboardTasksGroupLabel,
  DashboardTasksGroupList,
} from './styled';

const DashboardTasksGroup = ({
  dashboardTasksGroup,
  toggleDashboardTaskComplete,
  redirectToParentTask,
  storeAsCurrentTask,
}) => {
  const { groupName, tasks } = dashboardTasksGroup;
  return (
    <DashboardTasksGroupContainer>
      <DashboardTasksGroupLabel>
        {groupName} ({tasks.length})
      </DashboardTasksGroupLabel>
      <DashboardTasksGroupList>
        {tasks?.map(task => (
          <SlimTaskItem
            {...task}
            redirectToParentTask={redirectToParentTask}
            storeAsCurrentTask={storeAsCurrentTask}
            toggleTaskComplete={() => toggleDashboardTaskComplete(task)}
          />
        ))}
      </DashboardTasksGroupList>
    </DashboardTasksGroupContainer>
  );
};

export default DashboardTasksGroup;
