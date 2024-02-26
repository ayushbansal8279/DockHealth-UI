import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import DatePicker from 'components/task/DatePicker/DatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DateLabel from 'components/common/DateLabel/DateLabel';
import moment from 'moment';

const TaskItemDate = ({ value, onChange, readOnly = false }) => {
  const handleDateChange = useCallback(
    (newDate) => {
      onChange(newDate ? newDate.format('MM/DD/YYYY') : null);
    },
    [onChange],
  );

  let dateTimeValue = value;
  if (value?.length > 10) {
    dateTimeValue = moment.utc(value).toISOString();
  }

  return (
    <Box marginLeft="auto" marginRight="auto">
      <TaskItemPopover
        content={({ closePopover }) => (
          <DatePicker
            selectedDate={dateTimeValue}
            onDateChange={handleDateChange}
            onCloseClick={closePopover}
            // hideDateTime
          />
        )}
        disabled={readOnly}
      >
        <Tooltip
          placement="top"
          title={dateTimeValue ? 'Edit date' : 'Add date'}
        >
          {dateTimeValue ? (
            <DateLabel date={dateTimeValue} format="MM/DD/YYYY" />
          ) : (
            <div>
              <TaskIcon type="calendar" />
            </div>
          )}
        </Tooltip>
      </TaskItemPopover>
    </Box>
  );
};

export default TaskItemDate;
