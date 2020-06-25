import React from 'react';
import DashboardTaskItem from './DashboardTaskItem';
import {
  DashboardTasksGroupContainer,
  DashboardTasksGroupLabel,
  DashboardTasksGroupList,
} from './styled';

const DashboardTasksGroup = ({ dashboardTasksGroup }) => {
  const { groupName, tasks } = dashboardTasksGroup;
  return (
    <DashboardTasksGroupContainer>
      <DashboardTasksGroupLabel>
        {groupName} ({tasks.length})
      </DashboardTasksGroupLabel>
      <DashboardTasksGroupList>
        {tasks?.map(task => (
          <DashboardTaskItem {...task} />
        ))}
      </DashboardTasksGroupList>
    </DashboardTasksGroupContainer>
  );
};

export default DashboardTasksGroup;
