import React from 'react';
import CalendarIcon from 'img/bulk-edit/CalendarIcon';
import DueDatePicker from 'components/common/DueDatePicker/DueDatePicker';
import { WrapperContainer, IconBox } from './styled';

const BulkEditDueDateOption = ({ handleChangeDateTasks, isDisabled }) => {
  return (
    <DueDatePicker
      onDateChange={newDueDate => {
        handleChangeDateTasks(newDueDate.toISOString());
      }}
      calendarInitiallyOpen
    >
      <WrapperContainer disabled={isDisabled}>
        <IconBox>
          <CalendarIcon />
        </IconBox>
        <p>Date</p>
      </WrapperContainer>
    </DueDatePicker>
  );
};

export default BulkEditDueDateOption;
