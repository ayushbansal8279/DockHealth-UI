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
import spacing from 'styles/spacing';
import palette from 'styles/palette';

const TaskItemStartDate = ({ task, isDateHover, disabled = false }) => {
  const dispatch = useDispatch();
  const { taskIdentifier, startDate, hasRecurringSchedule, reminderType } =
    task || {};

  const handleDueDateChange = useCallback(
    (newDueDate) => {
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
            <>
              {isDateHover ? (
                <div style={{ display: 'flex' }}>
                  {' '}
                  <TaskIcon type="calendar" isActive />{' '}
                  <p
                    style={{
                      padding: `3px ${spacing.smallPlus}`,
                      color: `${palette.coolGrey1}`,
                    }}
                  >
                    None
                  </p>
                </div>
              ) : null}
            </>
          )}
        </>
      </Tooltip>
    </TaskItemPopover>
  );
};

export default TaskItemStartDate;
