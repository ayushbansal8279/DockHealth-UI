import React, { useCallback } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { checkDateTimeIntent, DueDateIntent, ReminderType } from 'helpers/task-helpers';
import { isWorkflowDueDateOverdue } from 'helpers/workflow-helpers';
import { useDispatch } from 'react-redux';
import { AddPlaceholder, DueDatesContainer, DueDateWrapper } from './styled';
import { openModal } from '@/app/modal/actions';
import { isDueDateValid } from '@/app/helpers/date-validation-helper';
import { adjustUTCDateForDateIntent } from '../../task/DueDatePicker/helpers';
import moment from 'moment';

const TaskTemplateDueDate = (props) => {
  const { workflow, disabled = false } = props;
  const { identifier, dueDateTime, reminderType, startDateTime } =
    workflow || {};
  const dispatch = useDispatch();

  const handleSave = useCallback(
    (updatedDueDateTime) => {
      const dueDateIntent = checkDateTimeIntent(updatedDueDateTime);
      const payload = {
        dueDateTime: updatedDueDateTime
          ? dueDateIntent === DueDateIntent.DATE
            ? moment.utc(updatedDueDateTime).startOf('day').toISOString()
            : moment(updatedDueDateTime).toISOString()
          : null,
        dueDateIntent: updatedDueDateTime ? dueDateIntent : DueDateIntent.DATE,
      };

      if (!updatedDueDateTime) payload.dueDateTimeCleared = true;

      dispatch(updatePartialWorkflow(identifier, payload));
    },
    [dispatch, identifier],
  );

  const handleDueDateChange = useCallback(
    (newDueDate) => {
      const isDateValid = isDueDateValid(startDateTime, newDueDate);
      if (isDateValid) {
        handleSave(newDueDate);
      } else {
        dispatch(
          openModal('DateWarning', {
            type: 'dueDate',
            onSave: () => handleSave(newDueDate),
          }),
        );
      }
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
            selectedDate={adjustUTCDateForDateIntent(dueDateTime ? moment(dueDateTime).local() : null, checkDateTimeIntent(dueDateTime))}
            disableRecurring
            onDateChange={handleDueDateChange}
            onCloseClick={closePopover}
            dueDateIntent={checkDateTimeIntent(dueDateTime)}
            dateType="dueDate"
          />
        )}
      >
        {dueDateTime ? (
          <DateLabel
            date={dueDateTime}
            isOverdue={isWorkflowDueDateOverdue(workflow)}
            hasReminder={reminderType && reminderType !== ReminderType.NONE}
            tootipTitle="Edit Due Date"
            dueDateIntent={checkDateTimeIntent(dueDateTime)}
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
