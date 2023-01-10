import React from 'react';
import { TaskNodeContainer } from './styled';

const TaskNodeWrapper = ({ children, selected, type, width }) => {
  return (
    <TaskNodeContainer selected={selected} type={type} width={width}>
      {children}
    </TaskNodeContainer>
  );
};

export default TaskNodeWrapper;
