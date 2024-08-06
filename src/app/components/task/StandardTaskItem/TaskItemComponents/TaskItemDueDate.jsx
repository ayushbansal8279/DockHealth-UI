import React, { useCallback } from 'react';
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
import moment from 'moment';
import { openModal } from '@/app/modal/actions';

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

  const handleSave = useCallback(
    (newDueDate) => {
      dispatch(updateTaskDueDate(task, newDueDate));
      onTaskDueDateChanged();
    },
    [dispatch, task],
  );

  const handleDueDateChange = useCallback(
    (newDueDate) => {
      const isDueDateValid =
        !startDate ||
        newDueDate === null ||
        moment(startDate).isSameOrBefore(moment(newDueDate));

      if (isDueDateValid) {
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
            selectedDate={dueDate}
            onDateChange={handleDueDateChange}
            recurring={hasRecurringSchedule}
            onCloseClick={closePopover}
          />
        )}
      >
        <>
          {dueDate ? (
            <DateLabel
              date={dueDate}
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
