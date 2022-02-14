import React, { useCallback } from 'react';
import { Box } from '@material-ui/core';
import moment from 'moment';
import DatePicker from 'components/task/DatePicker/DatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
// import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { DateBasicLabel, DateText } from './styled';

const TaskItemDate = ({ value, onChange, readOnly }) => {
  const handleDateChange = useCallback(
    newDate => {
      onChange(newDate);
    },
    [onChange],
  );

  return (
    <Box marginLeft="auto" marginRight="auto">
      <TaskItemPopover
        disabled={readOnly}
        content={({ closePopover }) => (
          <DatePicker
            selectedDate={value}
            onDateChange={handleDateChange}
            onCloseClick={closePopover}
          />
        )}
      >
        <Tooltip
          hideTooltip={readOnly}
          placement="top"
          title={value ? 'Edit date' : 'Add date'}
        >
          {value ? (
            <DateBasicLabel>
              <DateText>{moment(value).format('MM/DD/YY')}</DateText>
            </DateBasicLabel>
          ) : (
            <div>{/* <TaskIcon type="calendar" /> */}</div>
          )}
        </Tooltip>
      </TaskItemPopover>
    </Box>
  );
};

export default TaskItemDate;
