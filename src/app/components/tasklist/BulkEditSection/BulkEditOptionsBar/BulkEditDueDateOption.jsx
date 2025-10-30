import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import CalendarIcon from 'img/bulk-edit/CalendarIcon';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import BulkEditOption from 'components/bulk-edit/BulkEditOption/BulkEditOption';
import { checkDateTimeIntent } from '@/app/helpers/task-helpers';
import { adjustUTCDateForDateIntent } from '@/app/components/task/DueDatePicker/helpers';
import { openModal } from '@/app/modal/actions';
import moment from 'moment';

const BulkEditDueDateOption = ({
  handleChangeDateTasks,
  isDisabled,
  selectedDate,
  allSelectedTasksIdentifiers,
  allSelectedWorkflowIdentifiers,
}) => {
  const dispatch = useDispatch();
  const dueDateIntent = checkDateTimeIntent(selectedDate);

  const handleClearDateClick = useCallback(
    (clearCallback) => {
      dispatch(
        openModal('ClearDueDateConfirmation', {
          confirm: clearCallback,
        }),
      );
    },
    [dispatch],
  );

  return (
    <TaskItemPopover
      placement="bottom"
      content={({ closePopover }) => (
        <DueDatePicker
          onDateChange={(newDueDate) => {
            handleChangeDateTasks(newDueDate);
          }}
          selectedDate={adjustUTCDateForDateIntent(
            selectedDate ? moment(selectedDate).local() : null,
            dueDateIntent,
          )}
          allSelectedTasksIdentifiers={allSelectedTasksIdentifiers}
          allSelectedWorkflowIdentifiers={allSelectedWorkflowIdentifiers}
          onCloseClick={closePopover}
          dueDateIntent={dueDateIntent}
          dateType="dueDate"
          bulkEditDueDate
          onClearDateClick={handleClearDateClick}
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
