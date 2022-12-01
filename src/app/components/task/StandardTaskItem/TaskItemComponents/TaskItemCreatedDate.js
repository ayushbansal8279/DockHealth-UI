import React from 'react';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { ReminderType } from 'helpers/task-helpers';

const TaskItemCreatedDate = ({ task, disabled = false }) => {
  const {
    taskIdentifier,
    createdDateTime: dateCreated,
    hasRecurringSchedule,
    reminderType,
  } = task || {};

  return (
    <TaskItemPopover
      disabled={disabled}
      content={({ closePopover }) => (
        <DueDatePicker
          taskIdentifier={taskIdentifier}
          selectedDate={dateCreated}
          onDateChange={null}
          recurring={hasRecurringSchedule}
          onCloseClick={closePopover}
        />
      )}
    >
      <Tooltip placement="top" title="Date Created">
        <>
          {dateCreated ? (
            <DateLabel
              date={dateCreated}
              isOverdue={false}
              hasReminder={reminderType && reminderType !== ReminderType.NONE}
              hasRecurringSchedule={hasRecurringSchedule}
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

export default TaskItemCreatedDate;
