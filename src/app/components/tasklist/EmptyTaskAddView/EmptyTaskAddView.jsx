import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import EmptyListWrapper from './styled';

const EmptyTaskAddView = ({
  quickAddTask,
  children,
  taskListIdentifier,
  iconColorActive,
}) => {
  return (
    <EmptyListWrapper>
      <MontserratTypography variant="h3" weight="400" color="inherit">
        Create your first task
      </MontserratTypography>
      <Spacing vertical={3} />
      <QuickAddTaskInput
        taskListIdentifier={taskListIdentifier}
        quickAddTask={quickAddTask}
        validator={(value) => {
          if ([...value]?.filter((char) => char !== ' ').length < 2)
            return 'The task description is too short (min. 2 characters)';

          return null;
        }}
        iconColorActive={iconColorActive}
      />
      {children ? (
        <>
          <Spacing vertical={3} />
          {children}
        </>
      ) : null}
    </EmptyListWrapper>
  );
};

export default EmptyTaskAddView;
