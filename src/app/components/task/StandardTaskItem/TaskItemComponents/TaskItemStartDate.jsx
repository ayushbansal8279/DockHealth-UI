import React, { useCallback, useState } from 'react';
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
import { openModal } from '@/app/modal/actions';
import { isStartDateValid } from '@/app/helpers/date-validation-helper';
import moment from 'moment';

const TaskItemStartDate = ({ task, disabled = false }) => {
  const dispatch = useDispatch();
  const {
    taskIdentifier,
    startDate,
    hasRecurringSchedule,
    reminderType,
    dueDate,
  } = task || {};

  const [momentStartDate, setMomentStartDate] = useState(
    startDate ? moment(startDate) : null,
  );

  const handleSave = useCallback(
    (newStartDate) => {
      setMomentStartDate(
        !!newStartDate ? moment(newStartDate) : null,
      );
      dispatch(updateTaskStartDate(task, newStartDate));
      onTaskStartDateChanged();
    },
    [dispatch, task],
  );

  const handleDueDateChange = useCallback(
    (newStartDate) => {
      const isDateValid = isStartDateValid(dueDate, newStartDate);
      setMomentStartDate(moment(newStartDate));
      if (isDateValid) {
        handleSave(newStartDate);
      } else {
        dispatch(
          openModal('DateWarning', {
            type: 'startDate',
            onSave: () => handleSave(newStartDate),
          }),
        );
      }
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
            selectedDate={momentStartDate}
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
              date={momentStartDate}
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
