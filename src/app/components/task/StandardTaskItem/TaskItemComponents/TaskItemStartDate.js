import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { updateTaskStartDate } from 'actions/task-actions';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { ReminderType } from 'helpers/task-helpers';
import { onTaskStartDateChanged } from 'helpers/ga-event-helper';

const TaskItemStartDate = ({ task, disabled = false }) => {
  const dispatch = useDispatch();
  const { taskIdentifier, startDate, hasRecurringSchedule, reminderType } =
    task || {};

  const handleDueDateChange = useCallback(
    newDueDate => {
      dispatch(updateTaskStartDate(task, newDueDate));
      onTaskStartDateChanged();
    },
    [dispatch, task],
  );

  return (
    <TaskItemPopover
      disabled={disabled}
      content={({ closePopover }) => (
        <DueDatePicker
          taskIdentifier={taskIdentifier}
          selectedDate={startDate}
          onDateChange={handleDueDateChange}
          recurring={hasRecurringSchedule}
          onCloseClick={closePopover}
          disableRecurring
        />
      )}
    >
      <Tooltip
        placement="top"
        title={startDate ? 'Edit start date' : 'Add start date'}
      >
        <>
          {startDate ? (
            <DateLabel
              date={startDate}
              hasReminder={reminderType && reminderType !== ReminderType.NONE}
              hasRecurringSchedule={false}
            />
          ) : (
            <div>
              <TaskIcon type="calendar" />
            </div>
          )}
        </>
      </Tooltip>
    </TaskItemPopover>
  );
};

export default TaskItemStartDate;
