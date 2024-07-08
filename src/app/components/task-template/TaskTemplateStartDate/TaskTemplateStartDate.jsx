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

const TaskTemplateStartDate = (props) => {
  const { workflow, disabled = false } = props;
  const { identifier, startDateTime } = workflow || {};
  const dispatch = useDispatch();

  const handleStartDateChange = useCallback(
    (updatedDate) => {
      const payload = {
        startDateTime: updatedDate,
      };

      if (!updatedDate) payload.startDateTimeCleared = true;

      dispatch(updatePartialWorkflow(identifier, payload));
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
            selectedDate={startDateTime}
            disableRecurring
            onDateChange={handleStartDateChange}
            onCloseClick={closePopover}
          />
        )}
      >
        {startDateTime ? (
          <DateLabel date={startDateTime} tootipTitle="Edit Start Date" />
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
