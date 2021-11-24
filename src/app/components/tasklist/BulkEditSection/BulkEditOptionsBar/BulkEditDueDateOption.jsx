import React from 'react';
import CalendarIcon from 'img/bulk-edit/CalendarIcon';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import { WrapperContainer, IconBox } from './styled';

const BulkEditDueDateOption = ({ handleChangeDateTasks, isDisabled }) => {
  return (
    <TaskItemPopover
      placement="bottom"
      content={({ closePopover }) => (
        <DueDatePicker
          onDateChange={newDueDate => {
            handleChangeDateTasks(newDueDate);
          }}
          disableRecurring
          onCloseClick={closePopover}
        />
      )}
    >
      <WrapperContainer disabled={isDisabled}>
        <IconBox>
          <CalendarIcon />
        </IconBox>
        <p>Date</p>
      </WrapperContainer>
    </TaskItemPopover>
  );
};

export default BulkEditDueDateOption;
