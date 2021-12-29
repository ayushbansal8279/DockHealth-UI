import React from 'react';
import TaskViewTypeToolbarSelect from 'components/tasklist/TaskViewTypeToolbarSelect/TaskViewTypeToolbarSelect';
import TaskStatusToolbarSelect from 'components/tasklist/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import { ViewType } from 'helpers/view-type-helper';
import { TaskStatus } from 'helpers/task-helpers';
import { ToolbarContainer } from './styled';

const ListDetailsToolbar = () => {
  return (
    <ToolbarContainer>
      <TaskViewTypeToolbarSelect value={ViewType.LIST_VIEW} />
      <TaskStatusToolbarSelect value={TaskStatus.INCOMPLETE} />
    </ToolbarContainer>
  );
};

export default ListDetailsToolbar;
