import React, { useCallback } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { ReminderType } from 'helpers/task-helpers';
import { isWorkflowDueDateOverdue } from 'helpers/workflow-helpers';
import { useDispatch } from 'react-redux';
import { AddPlaceholder, DueDatesContainer, DueDateWrapper } from './styled';

const TaskTemplateDueDate = (props) => {
  const { workflow, disabled = false } = props;
  const { identifier, dueDateTime, reminderType } = workflow || {};
  const dispatch = useDispatch();

  const handleDueDateChange = useCallback(
    (updatedDueDateTime) => {
      const payload = { dueDateTime: updatedDueDateTime };

      if (!updatedDueDateTime) payload.dueDateTimeCleared = true;

      dispatch(updatePartialWorkflow(identifier, payload));
    },
    [dispatch, identifier],
  );

  return (
    <DueDatesContainer>
      <TaskItemPopover
        disabled={disabled}
        content={({ closePopover }) => (
          <DueDatePicker
            taskIdentifier={identifier}
            selectedDate={dueDateTime}
            disableRecurring
            onDateChange={handleDueDateChange}
            onCloseClick={closePopover}
          />
        )}
      >
        {dueDateTime ? (
          <DateLabel
            date={dueDateTime}
            isOverdue={isWorkflowDueDateOverdue(workflow)}
            hasReminder={reminderType && reminderType !== ReminderType.NONE}
            tootipTitle="Edit Due Date"
          />
        ) : (
          <DueDateWrapper>
            <Tooltip placement="top" title="Add Due Date">
              <AddPlaceholder>
                <div style={{ display: 'flex' }}>
                  <TaskIcon type="calendar" isActive />
                </div>
              </AddPlaceholder>
            </Tooltip>
          </DueDateWrapper>
        )}
      </TaskItemPopover>
    </DueDatesContainer>
  );
};

export default TaskTemplateDueDate;
