import React, { useCallback } from 'react';
import { Box } from '@material-ui/core';
import DatePicker from 'components/task/DatePicker/DatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DateLabel from 'components/common/DateLabel/DateLabel';

const TaskItemDate = ({ value, onChange }) => {
  const handleDateChange = useCallback(
    newDate => {
      onChange(newDate ? newDate.format('MM/DD/YYYY') : null);
    },
    [onChange],
  );

  return (
    <Box marginLeft="auto" marginRight="auto">
      <TaskItemPopover
        content={({ closePopover }) => (
          <DatePicker
            selectedDate={value}
            onDateChange={handleDateChange}
            onCloseClick={closePopover}
            hideDateTime
          />
        )}
      >
        <Tooltip placement="top" title={value ? 'Edit date' : 'Add date'}>
          {value ? (
            <DateLabel date={value} format="MM/DD/YYYY" />
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
