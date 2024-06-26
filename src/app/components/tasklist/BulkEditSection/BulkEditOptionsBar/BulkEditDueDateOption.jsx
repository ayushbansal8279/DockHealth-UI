import React from 'react';
import CalendarIcon from 'img/bulk-edit/CalendarIcon';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import BulkEditOption from 'components/bulk-edit/BulkEditOption/BulkEditOption';

const BulkEditDueDateOption = ({
  handleChangeDateTasks,
  isDisabled,
  selectedDate,
}) => {
  return (
    <TaskItemPopover
      placement="bottom"
      content={({ closePopover }) => (
        <DueDatePicker
          onDateChange={(newDueDate) => {
            handleChangeDateTasks(newDueDate);
          }}
          selectedDate={selectedDate}
          disableRecurring
          onCloseClick={closePopover}
        />
      )}
    >
      <BulkEditOption
        iconComponent={CalendarIcon}
        title="Date"
        isDisabled={isDisabled}
      />
    </TaskItemPopover>
  );
};

export default BulkEditDueDateOption;
