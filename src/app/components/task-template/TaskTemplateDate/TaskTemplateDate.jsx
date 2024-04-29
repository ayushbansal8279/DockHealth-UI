import React from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { ReminderType } from 'helpers/task-helpers';

const TaskTemplateDate = ({ dateTime, title, workflow }) => {
  const { reminderType } = workflow || {};

  return (
    <Tooltip placement="top" title={title}>
      {dateTime ? (
        <DateLabel
          date={dateTime}
          isOverdue={false}
          hasReminder={reminderType && reminderType !== ReminderType.NONE}
          hasRecurringSchedule={false}
          showTime
          // timeFormat="HH:mm"
        />
      ) : (
        <></>
      )}
    </Tooltip>
  );
};

export default TaskTemplateDate;
