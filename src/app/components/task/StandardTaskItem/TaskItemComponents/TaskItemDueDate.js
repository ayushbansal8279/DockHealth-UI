import React from 'react';
import moment from 'moment';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { isDueDateOverdue } from 'helpers/task-helpers';
import { onTaskDueDateChanged } from 'helpers/ga-event-helper';
import { DueDateBasicLabel, StandardTaskItemCell } from '../../styled';

const dueDateQuickSelectOptions = [
  {
    label: 'Today',
    date: moment(),
  },
  {
    label: 'Tomorrow',
    date: moment().add(1, 'days'),
  },
];

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
      <PopoverDatepicker
        selectedDate={dueDate}
        onDateChange={date => {
          const existingTime = dueDate ? moment(dueDate).format('HH:mm') : '';

          updateDueDate(
            task,
            moment(`${date} ${existingTime}`, 'YYYY-MM-DD HH:mm'),
            true,
          );

          onTaskDueDateChanged();
        }}
        quickSelectOptions={dueDateQuickSelectOptions}
      >
        {({ elementReference, setIsPopoverOpen, isPopoverOpen }) => (
          <button
            type="button"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            ref={elementReference}
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
          </button>
        )}
      </PopoverDatepicker>
    </StandardTaskItemCell>
  );
};

export default TaskItemDueDate;
