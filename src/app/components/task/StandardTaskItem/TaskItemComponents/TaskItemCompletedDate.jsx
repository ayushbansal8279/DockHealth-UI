import React from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { ReminderType } from 'helpers/task-helpers';

const TaskItemCompletedDate = ({ task }) => {
  const { completedDt: completedDate, reminderType } = task || {};

  return (
    <Tooltip placement="top" title="Date Completed">
      <>
        {completedDate ? (
          <DateLabel
            date={completedDate}
            isOverdue={false}
            hasReminder={reminderType && reminderType !== ReminderType.NONE}
            hasRecurringSchedule={false}
            format="MM/DD/YY"
            showTime
            // timeFormat="HH:mm"
          />
        ) : (
          <></>
        )}
      </>
    </Tooltip>
  );
};

export default TaskItemCompletedDate;
