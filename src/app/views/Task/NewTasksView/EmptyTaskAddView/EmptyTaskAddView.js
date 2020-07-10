import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import EmptyListWrapper from './styled';

const EmptyTaskAddView = ({ quickAddTask }) => {
  return (
    <EmptyListWrapper>
      <MontserratTypography variant="h3" weight="400" color="inherit">
        Create your first task
      </MontserratTypography>
      <Spacing vertical={3} />
      <QuickAddTaskInput
        quickAddTask={quickAddTask}
        validator={value => {
          if ([...value]?.filter(char => char !== ' ').length < 2)
            return 'The task description is too short (min. 2 characters)';

          return null;
        }}
      />
    </EmptyListWrapper>
  );
};

export default EmptyTaskAddView;
