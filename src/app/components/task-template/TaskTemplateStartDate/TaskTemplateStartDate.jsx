import React, { useCallback } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { useDispatch } from 'react-redux';
import { AddPlaceholder } from '../TaskTemplateDueDate/styled';

const TaskTemplateStartDate = (props) => {
  const { workflow, disabled = false, isHover } = props;
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
    [dispatch, identifier, startDateTime],
  );

  return (
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
          {isHover ? (
            <Tooltip placement="top" title="Add Start Date">
              <AddPlaceholder>
                <div style={{ display: 'flex' }}>
                  <TaskIcon type="calendar" isActive={true} />
                </div>
              </AddPlaceholder>
            </Tooltip>
          ) : null}
        </>
      )}
    </TaskItemPopover>
  );
};

export default TaskTemplateStartDate;
