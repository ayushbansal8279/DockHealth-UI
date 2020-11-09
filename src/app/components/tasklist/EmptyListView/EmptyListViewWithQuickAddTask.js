import React from 'react';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import Spacing from 'components/common/Spacing';
import { EmptyListContainer } from './styled';

const EmptyListViewWithQuickAddTask = ({
  quickAddTask,
  children,
  taskListIdentifier,
}) => (
  <EmptyListContainer>
    <QuickAddTaskInput
      taskListIdentifier={taskListIdentifier}
      quickAddTask={quickAddTask}
      validator={value => {
        if ([...value]?.filter(char => char !== ' ').length < 2)
          return 'The task description is too short (min. 2 characters)';

        return null;
      }}
    />
    <Spacing vertical={5} />
    {children}
  </EmptyListContainer>
);

export default EmptyListViewWithQuickAddTask;
