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
import {
  AddPlaceholder,
  StartDateContainer,
  StartDateWrapper,
} from '../../styled';

const TaskItemStartDate = ({ task, disabled = false }) => {
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
    <StartDateContainer>
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
        <>
          {startDate ? (
            <DateLabel
              date={startDate}
              hasReminder={reminderType && reminderType !== ReminderType.NONE}
              hasRecurringSchedule={false}
              tootipTitle="Edit Start Date"
            />
          ) : (
            <StartDateWrapper>
              <Tooltip placement="top" title="Add Start Date">
                <AddPlaceholder>
                  <div style={{ display: 'flex' }}>
                    {' '}
                    <TaskIcon type="calendar" isActive />
                  </div>
                </AddPlaceholder>
              </Tooltip>
            </StartDateWrapper>
          )}
        </>
      </TaskItemPopover>
    </StartDateContainer>
  );
};

export default TaskItemStartDate;
