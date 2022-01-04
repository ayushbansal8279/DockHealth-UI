import React, { useCallback } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { updateTaskDueDate } from 'actions/task-actions';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Spacing from 'components/common/Spacing';
import {
  checkIfTemplateTask,
  isDueDateOverdue,
  ReminderType,
} from 'helpers/task-helpers';
import { onTaskDueDateChanged } from 'helpers/ga-event-helper';
import RecurringIcon from 'img/recurring-arrows';
import ReminderIcon from 'img/reminder';
import {
  DueDateBasicLabel,
  StandardTaskItemCell,
  DateText,
} from '../../styled';

const TaskItemDueDate = ({ task, isHovered }) => {
  const dispatch = useDispatch();
  const { taskIdentifier, dueDate, hasRecurringSchedule, reminderType } =
    task || {};

  const isTemplateTask = checkIfTemplateTask(task);

  const handleDueDateChange = useCallback(
    newDueDate => {
      dispatch(updateTaskDueDate(task, newDueDate));
      onTaskDueDateChanged();
    },
    [dispatch, task],
  );

  return (
    <StandardTaskItemCell
      paddingLeft="tiny"
      paddingRight="tiny"
      width="78px"
      justify="center"
      onContextMenu={event => {
        event.stopPropagation();
      }}
    >
      {!isTemplateTask && (
        <TaskItemPopover
          content={({ closePopover }) => (
            <DueDatePicker
              taskIdentifier={taskIdentifier}
              selectedDate={dueDate}
              onDateChange={handleDueDateChange}
              recurring={hasRecurringSchedule}
              onCloseClick={closePopover}
            />
          )}
        >
          <Tooltip
            placement="top"
            title={dueDate ? 'Edit due date' : 'Add due date'}
          >
            {dueDate ? (
              <DueDateBasicLabel isOverdue={isDueDateOverdue(task)}>
                <DateText>{moment(dueDate).format('MM/DD')}</DateText>
                {reminderType && reminderType !== ReminderType.NONE && (
                  <>
                    <Spacing horizontal={2} />
                    <ReminderIcon />
                  </>
                )}
                {hasRecurringSchedule && (
                  <>
                    <Spacing horizontal={2} />
                    <RecurringIcon />
                  </>
                )}
              </DueDateBasicLabel>
            ) : (
              <div>
                <TaskIcon type="calendar" isHovered={isHovered} />
              </div>
            )}
          </Tooltip>
        </TaskItemPopover>
      )}
    </StandardTaskItemCell>
  );
};

export default TaskItemDueDate;
