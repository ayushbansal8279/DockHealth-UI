import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import EmptyListWrapper from './styled';
import AddTaskInputWrapper from '../styled';

const EmptyTasksView = ({ quickAddTask }) => {
  return (
    <EmptyListWrapper>
      <MontserratTypography variant="h3" weight="400" color="inherit">
        Create your first task
      </MontserratTypography>
      <Spacing vertical={3} />
      <AddTaskInputWrapper>
        <input
          type="text"
          placeholder="Add task"
          onKeyDown={event =>
            event.keyCode === 13 && quickAddTask(event.target.value)
          }
        />
      </AddTaskInputWrapper>
    </EmptyListWrapper>
  );
};

export default EmptyTasksView;
