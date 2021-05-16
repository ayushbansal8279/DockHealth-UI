import React from 'react';
import CalendarIcon from 'img/bulk-edit/CalendarIcon';
import DueDatePickerPopover from 'components/task/DueDatePicker/DueDatePickerPopover';
import { WrapperContainer, IconBox } from './styled';

const BulkEditDueDateOption = ({ handleChangeDateTasks, isDisabled }) => {
  return (
    <DueDatePickerPopover
      onDateChange={newDueDate => {
        handleChangeDateTasks(newDueDate.toISOString());
      }}
      disableRecurring
    >
      <WrapperContainer disabled={isDisabled}>
        <IconBox>
          <CalendarIcon />
        </IconBox>
        <p>Date</p>
      </WrapperContainer>
    </DueDatePickerPopover>
  );
};

export default BulkEditDueDateOption;
