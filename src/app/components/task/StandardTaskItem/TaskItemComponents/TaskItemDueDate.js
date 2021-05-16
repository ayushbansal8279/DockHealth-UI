import React, { useCallback } from 'react';
import moment from 'moment';
import DueDatePickerPopover from 'components/task/DueDatePicker/DueDatePickerPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Spacing from 'components/common/Spacing';
import { isDueDateOverdue, ReminderType } from 'helpers/task-helpers';
import { onTaskDueDateChanged } from 'helpers/ga-event-helper';
import RecurringIcon from 'img/recurring-arrows';
import ReminderIcon from 'img/reminder';
import {
  DueDateBasicLabel,
  StandardTaskItemCell,
  DateText,
} from '../../styled';

const TaskItemDueDate = ({ task, isHovered, updateDueDate }) => {
  const { taskIdentifier, dueDate, hasRecurringSchedule, reminderType } =
    task || {};

  const handleDueDateChange = useCallback(
    newDueDate => {
      updateDueDate(task, newDueDate, true);

      onTaskDueDateChanged();
    },
    [task, updateDueDate],
  );

  return (
    <StandardTaskItemCell
      paddingLeft="tiny"
      paddingRight="tiny"
      width="78px"
      justify="center"
      onContextMenu={event => {
        event.stopPropagation();
      }}
    >
      <DueDatePickerPopover
        taskIdentifier={taskIdentifier}
        selectedDate={dueDate}
        onDateChange={handleDueDateChange}
        recurring={hasRecurringSchedule}
      >
        <Tooltip
          placement="top"
          title={dueDate ? 'Edit due date' : 'Add due date'}
        >
          {dueDate ? (
            <DueDateBasicLabel isOverdue={isDueDateOverdue(task)}>
              <DateText>{moment(dueDate).format('MM/DD')}</DateText>
              {reminderType && reminderType !== ReminderType.NONE && (
                <>
                  <Spacing horizontal={2} />
                  <ReminderIcon />
                </>
              )}
              {hasRecurringSchedule && (
                <>
                  <Spacing horizontal={2} />
                  <RecurringIcon />
                </>
              )}
            </DueDateBasicLabel>
          ) : (
            <TaskIcon type="calendar" isHovered={isHovered} />
          )}
        </Tooltip>
      </DueDatePickerPopover>
    </StandardTaskItemCell>
  );
};

export default TaskItemDueDate;
