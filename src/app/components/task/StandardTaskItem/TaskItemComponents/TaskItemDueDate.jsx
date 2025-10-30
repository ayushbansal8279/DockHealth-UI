import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTaskDueDate } from 'actions/task-actions';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DateLabel from 'components/common/DateLabel/DateLabel';
import {
  checkDateTimeIntent,
  isDueDateOverdue,
  ReminderType,
} from 'helpers/task-helpers';
import { onTaskDueDateChanged } from 'helpers/ga-event-helper';
import {
  AddPlaceholder,
  DueDatesContainer,
  DueDateWrapper,
} from '../../styled';
import { openModal } from '@/app/modal/actions';
import { isDueDateValid } from '@/app/helpers/date-validation-helper';
import moment from 'moment';
import { adjustUTCDateForDateIntent } from '../../DueDatePicker/helpers';

const TaskItemDueDate = ({
  task,
  disabled = false,
  format,
  showTime,
  showReminder,
  showRecurring,
  isBorderColumnItem,
}) => {
  const dispatch = useDispatch();
  const {
    taskIdentifier,
    dueDate,
    dueDateIntent,
    hasRecurringSchedule,
    reminderType,
    startDate,
  } = task || {};

  const [momentDueDate, setMomentDueDate] = useState(() =>
    dueDate ? moment(dueDate) : null,
  );

  useEffect(() => {
    setMomentDueDate(dueDate ? moment(dueDate) : null);
  }, [dueDate]);

  const handleSave = useCallback(
    (newDueDate) => {
      setMomentDueDate(!!newDueDate ? moment(newDueDate) : null);
      const dueDateIntent = checkDateTimeIntent(newDueDate);
      dispatch(updateTaskDueDate(task, newDueDate, dueDateIntent));
      onTaskDueDateChanged();
    },
    [dispatch, task],
  );

  const handleDueDateChange = useCallback(
    (newDueDate) => {
      const isDateValid = isDueDateValid(startDate, newDueDate);
      if (isDateValid) {
        setMomentDueDate(newDueDate ? moment(newDueDate) : null);
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
    <DueDatesContainer>
      <TaskItemPopover
        disabled={disabled}
        content={({ closePopover }) => (
          <DueDatePicker
            taskIdentifier={taskIdentifier}
            selectedDate={adjustUTCDateForDateIntent(
              momentDueDate,
              dueDateIntent,
            )}
            onDateChange={handleDueDateChange}
            recurring={hasRecurringSchedule}
            onCloseClick={closePopover}
            dueDateIntent={dueDateIntent}
            dateType="dueDate"
            onClearDateClick={handleClearDateClick}
          />
        )}
      >
        <>
          {dueDate ? (
            <DateLabel
              date={momentDueDate}
              dueDateIntent={dueDateIntent}
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
            <DueDateWrapper isBorderColumnItem={isBorderColumnItem}>
              <Tooltip placement="top" title="Add Due Date">
                <AddPlaceholder isBorderColumnItem={isBorderColumnItem}>
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
