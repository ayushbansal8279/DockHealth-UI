import React, { useCallback } from 'react';
import DatePicker from 'components/task/DatePicker/DatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DateLabel from 'components/common/DateLabel/DateLabel';
import moment from 'moment';
import { DateWrapper, DateIconWrapper } from './styled';
import { DueDateIntent } from '@/app/helpers/task-helpers';

const TaskItemDate = ({ value, onChange, readOnly = false, dateTimeIntent }) => {
  const handleDateChange = useCallback(
    (newDate) => {
      onChange(newDate);
    },
    [onChange],
  );

  let dateTimeValue = value;
  if (value?.length > 10) {
    dateTimeValue = moment.utc(value).toISOString();
  }

  return (
    <DateWrapper>
      <TaskItemPopover
        content={({ closePopover }) => (
          <DatePicker
            selectedDate={dateTimeValue}
            onDateChange={handleDateChange}
            onCloseClick={closePopover}
            showTime={dateTimeIntent === DueDateIntent.DATETIME_ABSOLUTE}
          />
        )}
        disabled={readOnly}
      >
        <Tooltip
          placement="top"
          title={dateTimeValue ? 'Edit date' : 'Add date'}
        >
          {dateTimeValue ? (
            <DateLabel
              date={dateTimeValue} 
              format="MM/DD/YYYY" 
              dueDateIntent={dateTimeIntent}
            />
          ) : (
            <DateIconWrapper>
              <TaskIcon type="calendar" />
            </DateIconWrapper>
          )}
        </Tooltip>
      </TaskItemPopover>
    </DateWrapper>
  );
};

export default TaskItemDate;
