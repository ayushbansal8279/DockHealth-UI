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
import { AddPlaceholder } from '../../styled';

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
      {/* <Tooltip
        placement="top"
        title={startDate ? 'Edit Start Date' : 'Add Start Date'}
      > */}
      <>
        {startDate ? (
          <DateLabel
            date={startDate}
            hasReminder={reminderType && reminderType !== ReminderType.NONE}
            hasRecurringSchedule={false}
            tootipTitle="Edit Start Date"
          />
        ) : (
          <>
            {isDateHover ? (
              <Tooltip placement="top" title="Add Start Date">
                <AddPlaceholder>
                  <div style={{ display: 'flex' }}>
                    {' '}
                    <TaskIcon type="calendar" isActive />
                  </div>
                </AddPlaceholder>
              </Tooltip>
            ) : null}
          </>
        )}
      </>
      {/* </Tooltip> */}
    </TaskItemPopover>
  );
};

export default TaskItemStartDate;
