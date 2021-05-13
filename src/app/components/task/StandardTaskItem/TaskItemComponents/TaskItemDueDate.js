import React from 'react';
import moment from 'moment';
import DueDatePicker from 'components/common/DueDatePicker/DueDatePicker';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { isDueDateOverdue } from 'helpers/task-helpers';
import { onTaskDueDateChanged } from 'helpers/ga-event-helper';
import { DueDateBasicLabel, StandardTaskItemCell } from '../../styled';

const TaskItemDueDate = ({ dueDate, task, isHovered, updateDueDate }) => {
  return (
    <StandardTaskItemCell
      paddingLeft="tiny"
      paddingRight="tiny"
      width="60px"
      justify="center"
      onContextMenu={event => {
        event.stopPropagation();
      }}
    >
      <DueDatePicker
        selectedDate={dueDate}
        onDateChange={newDueDate => {
          updateDueDate(task, newDueDate, true);

          onTaskDueDateChanged();
        }}
      >
        <Tooltip
          placement="top"
          title={dueDate ? 'Edit due date' : 'Add due date'}
        >
          {dueDate ? (
            <DueDateBasicLabel isOverdue={isDueDateOverdue(task)}>
              {moment(dueDate).format('MM/DD')}
            </DueDateBasicLabel>
          ) : (
            <TaskIcon type="calendar" isHovered={isHovered} />
          )}
        </Tooltip>
      </DueDatePicker>
    </StandardTaskItemCell>
  );
};

export default TaskItemDueDate;
