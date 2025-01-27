import React from 'react';
import CalendarIcon from 'img/bulk-edit/CalendarIcon';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import BulkEditOption from 'components/bulk-edit/BulkEditOption/BulkEditOption';
import { checkDateTimeIntent } from '@/app/helpers/task-helpers';
import { adjustUTCDateForDateIntent } from '@/app/components/task/DueDatePicker/helpers';
import moment from 'moment';

const BulkEditDueDateOption = ({
  handleChangeDateTasks,
  isDisabled,
  selectedDate,
}) => {

  const dueDateIntent = checkDateTimeIntent(selectedDate);

  return (
    <TaskItemPopover
      placement="bottom"
      content={({ closePopover }) => (
        <DueDatePicker
          onDateChange={(newDueDate) => {
            handleChangeDateTasks(newDueDate);
          }}
          selectedDate={adjustUTCDateForDateIntent(selectedDate ? moment(selectedDate).local() : null, dueDateIntent)}
          disableRecurring
          onCloseClick={closePopover}
          dueDateIntent={dueDateIntent}
          dateType="dueDate"
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
