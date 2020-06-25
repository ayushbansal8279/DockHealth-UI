import React from 'react';
import SlimTaskItem from 'components/common/TaskItem/SlimTaskItem/SlimTaskItem';
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
          <SlimTaskItem {...task} />
        ))}
      </DashboardTasksGroupList>
    </DashboardTasksGroupContainer>
  );
};

export default DashboardTasksGroup;
