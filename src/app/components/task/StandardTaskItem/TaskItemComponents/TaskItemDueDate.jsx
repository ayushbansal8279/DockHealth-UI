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
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { AddPlaceholder } from '../../styled';

const TaskItemDueDate = ({ task, isDateHover, disabled = false }) => {
  const dispatch = useDispatch();
  const { taskIdentifier, dueDate, hasRecurringSchedule, reminderType } =
    task || {};

  const handleDueDateChange = useCallback(
    (newDueDate) => {
      dispatch(updateTaskDueDate(task, newDueDate));
      onTaskDueDateChanged();
    },
    [dispatch, task],
  );

  return (
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
      {/* <Tooltip
        placement="top"
        title={dueDate ? 'Edit Due Date' : 'Add Due Date'}
      > */}
      <>
        {dueDate ? (
          <DateLabel
            date={dueDate}
            isOverdue={isDueDateOverdue(task)}
            hasReminder={reminderType && reminderType !== ReminderType.NONE}
            hasRecurringSchedule={hasRecurringSchedule}
            tootipTitle="Edit Due Date"
          />
        ) : (
          <>
            {isDateHover ? (
              <Tooltip placement="top" title="Add Due Date">
                <AddPlaceholder>
                  <div style={{ display: 'flex' }}>
                    <TaskIcon type="calendar" isActive />
                    <p
                      style={{
                        padding: `3px ${spacing.smallPlus}`,
                        // color: `${palette.coolGrey1}`,
                      }}
                    >
                      None
                    </p>
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

export default TaskItemDueDate;
