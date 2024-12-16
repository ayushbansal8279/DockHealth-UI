import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTaskDueDate } from 'actions/task-actions';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { isDueDateOverdue, ReminderType } from 'helpers/task-helpers';
import { onTaskDueDateChanged } from 'helpers/ga-event-helper';
import {
  AddPlaceholder,
  DueDatesContainer,
  DueDateWrapper,
} from '../../styled';
import { openModal } from '@/app/modal/actions';
import { isDueDateValid } from '@/app/helpers/date-validation-helper';
import moment from 'moment';

const TaskItemDueDate = ({
  task,
  disabled = false,
  format,
  showTime,
  showReminder,
  showRecurring,
}) => {
  const dispatch = useDispatch();
  const {
    taskIdentifier,
    dueDate,
    hasRecurringSchedule,
    reminderType,
    startDate,
  } = task || {};

  const [momentDueDate, setMomentDueDate] = useState(() => dueDate ? moment(dueDate) : null);

  useEffect(() => {
    setMomentDueDate(dueDate ? moment(dueDate) : null)
  }, [dueDate]);

  const handleSave = useCallback(
    (newDueDate) => {
      setMomentDueDate(
        !!newDueDate ? moment(newDueDate) : null,
      );
      dispatch(updateTaskDueDate(task, newDueDate));
      onTaskDueDateChanged();
    },
    [dispatch, task],
  );

  const handleDueDateChange = useCallback(
    (newDueDate) => {
      const isDateValid = isDueDateValid(startDate, newDueDate);
      setMomentDueDate(newDueDate ? moment(newDueDate) : null);
      if (isDateValid) {
        handleSave(newDueDate);
      } else {
        dispatch(
          openModal('DateWarning', {
            type: 'dueDate',
            onSave: () => handleSave(newDueDate),
          }),
        );
      }
    },
    [dispatch, task],
  );

  return (
    <DueDatesContainer>
      <TaskItemPopover
        disabled={disabled}
        content={({ closePopover }) => (
          <DueDatePicker
            taskIdentifier={taskIdentifier}
            selectedDate={momentDueDate}
            onDateChange={handleDueDateChange}
            recurring={hasRecurringSchedule}
            onCloseClick={closePopover}
          />
        )}
      >
        <>
          {dueDate ? (
            <DateLabel
              date={momentDueDate}
              isOverdue={isDueDateOverdue(task)}
              hasReminder={reminderType && reminderType !== ReminderType.NONE}
              hasRecurringSchedule={hasRecurringSchedule}
              tootipTitle="Edit Due Date"
              format={format}
              showTime={showTime}
              showReminder={showReminder}
              showRecurring={showRecurring}
            />
          ) : (
            <DueDateWrapper>
              <Tooltip placement="top" title="Add Due Date">
                <AddPlaceholder>
                  <div style={{ display: 'flex' }}>
                    <TaskIcon type="calendar" isActive />
                  </div>
                </AddPlaceholder>
              </Tooltip>
            </DueDateWrapper>
          )}
        </>
      </TaskItemPopover>
    </DueDatesContainer>
  );
};

export default TaskItemDueDate;
