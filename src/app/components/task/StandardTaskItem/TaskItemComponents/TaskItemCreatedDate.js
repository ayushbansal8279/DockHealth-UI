import React from 'react';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { ReminderType } from 'helpers/task-helpers';

const TaskItemCreatedDate = ({ task }) => {
  const { createdDateTime: dateCreated, reminderType } = task || {};

  return (
    <Tooltip placement="top" title="Date Created">
      <>
        {dateCreated ? (
          <DateLabel
            date={dateCreated}
            isOverdue={false}
            hasReminder={reminderType && reminderType !== ReminderType.NONE}
            hasRecurringSchedule={false}
          />
        ) : (
          <div>
            <TaskIcon type="calendar" />
          </div>
        )}
      </>
    </Tooltip>
  );
};

export default TaskItemCreatedDate;
