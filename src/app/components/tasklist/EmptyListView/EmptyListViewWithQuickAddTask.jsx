import React from 'react';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import Spacing from 'components/common/Spacing';
import { EmptyListContainer } from './styled';

const EmptyListViewWithQuickAddTask = ({
  quickAddTask,
  children,
  taskListIdentifier,
  iconColorActive,
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
      iconColorActive={iconColorActive}
    />
    <Spacing vertical={5} />
    {children}
  </EmptyListContainer>
);

export default EmptyListViewWithQuickAddTask;
