import React from 'react';
import { TaskNodeContainer } from './styled';

const TaskNodeWrapper = ({ children, selected, type }) => {
  return (
    <TaskNodeContainer selected={selected} type={type}>
      {children}
    </TaskNodeContainer>
  );
};

export default TaskNodeWrapper;
