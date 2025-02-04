import React, { useCallback } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { useDispatch } from 'react-redux';
import {
  AddPlaceholder,
  StartDateContainer,
  StartDateWrapper,
} from '../TaskTemplateDueDate/styled';
import { openModal } from '@/app/modal/actions';
import { isStartDateValid } from '@/app/helpers/date-validation-helper';
import { adjustUTCDateForDateIntent } from '../../task/DueDatePicker/helpers';
import { checkDateTimeIntent, DueDateIntent } from '@/app/helpers/task-helpers';
import moment from 'moment';
import { formatDateTime } from '@/app/helpers/date-intent-helpers';

const TaskTemplateStartDate = (props) => {
  const { workflow, disabled = false } = props;
  const { identifier, startDateTime, startDateIntent, dueDateTime } = workflow || {};
  const dispatch = useDispatch();

  const handleSave = useCallback(
    (updatedDate) => {
      const startDateIntent = checkDateTimeIntent(updatedDate);
      const payload = {
        startDateTime: formatDateTime(updatedDate, startDateIntent),
        startDateIntent: updatedDate ? startDateIntent : DueDateIntent.DATE,
      };

      if (!updatedDate) payload.startDateTimeCleared = true;

      dispatch(updatePartialWorkflow(identifier, payload));
    },
    [dispatch, identifier],
  );

  const handleStartDateChange = useCallback(
    (newStartDate) => {
      const isDateValid = isStartDateValid(dueDateTime, newStartDate);
      if (isDateValid) {
        handleSave(newStartDate);
      } else {
        dispatch(
          openModal('DateWarning', {
            type: 'startDate',
            onSave: () => handleSave(newStartDate),
          }),
        );
      }
    },
    [dispatch, identifier],
  );

  return (
    <StartDateContainer>
      <TaskItemPopover
        disabled={disabled}
        content={({ closePopover }) => (
          <DueDatePicker
            taskIdentifier={identifier}
            selectedDate={adjustUTCDateForDateIntent(startDateTime ? moment(startDateTime).local() : null, startDateIntent)}
            disableRecurring
            onDateChange={handleStartDateChange}
            onCloseClick={closePopover}
            dueDateIntent={startDateIntent}
            dateType="dueDate"
          />
        )}
      >
        {startDateTime ? (
          <DateLabel 
            date={startDateTime} 
            tootipTitle="Edit Start Date" 
            dueDateIntent={startDateIntent}
          />
        ) : (
          <>
            <StartDateWrapper>
              <Tooltip placement="top" title="Add Start Date">
                <AddPlaceholder>
                  <div style={{ display: 'flex' }}>
                    <TaskIcon type="calendar" isActive />
                  </div>
                </AddPlaceholder>
              </Tooltip>
            </StartDateWrapper>
          </>
        )}
      </TaskItemPopover>
    </StartDateContainer>
  );
};

export default TaskTemplateStartDate;
