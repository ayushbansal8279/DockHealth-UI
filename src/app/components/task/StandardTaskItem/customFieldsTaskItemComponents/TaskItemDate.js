import React, { useCallback } from 'react';
import moment from 'moment';
import DatePicker from 'components/task/DatePicker/DatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { CustomFieldWidthConfig, FieldType } from 'helpers/field-type-helpers';
import { DateBasicLabel, StandardTaskItemCell, DateText } from './styled';

const TaskItemDate = ({ value, onChange, readOnly }) => {
  const handleDateChange = useCallback(
    newDate => {
      onChange(newDate);
    },
    [onChange],
  );

  return (
    <StandardTaskItemCell
      paddingLeft="tiny"
      paddingRight="tiny"
      width={CustomFieldWidthConfig[FieldType.DATE]}
      justify="center"
      onContextMenu={event => {
        event.stopPropagation();
      }}
    >
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
              <DateText>{moment(value).format('MM/DD/YYYY')}</DateText>
            </DateBasicLabel>
          ) : (
            <div>
              <TaskIcon type="calendar" />
            </div>
          )}
        </Tooltip>
      </TaskItemPopover>
    </StandardTaskItemCell>
  );
};

export default TaskItemDate;
