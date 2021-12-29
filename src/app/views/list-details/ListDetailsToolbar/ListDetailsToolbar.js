import React from 'react';
import TaskViewTypeToolbarSelect from 'components/tasklist/TaskViewTypeToolbarSelect/TaskViewTypeToolbarSelect';
import TaskStatusToolbarSelect from 'components/tasklist/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import { ToolbarContainer } from './styled';

const ListDetailsToolbar = () => {
  return (
    <ToolbarContainer>
      <TaskViewTypeToolbarSelect />
      <TaskStatusToolbarSelect />
    </ToolbarContainer>
  );
};

export default ListDetailsToolbar;
