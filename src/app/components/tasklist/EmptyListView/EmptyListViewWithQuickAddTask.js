import React from 'react';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import Spacing from 'components/common/Spacing';
import { EmptyListContainer } from './styled';

const EmptyListViewWithQuickAddTask = ({ quickAddTask, children }) => (
  <EmptyListContainer>
    <QuickAddTaskInput quickAddTask={quickAddTask} />
    <Spacing vertical={5} />
    <p>{children}</p>
  </EmptyListContainer>
);

export default EmptyListViewWithQuickAddTask;
