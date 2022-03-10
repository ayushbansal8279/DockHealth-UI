import React, { useCallback } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { useDispatch } from 'react-redux';

const TaskTemplateStartDate = props => {
  const { workflow, isHovered } = props;
  const { identifier, startDateTime } = workflow || {};
  const dispatch = useDispatch();

  const handleStartDateChange = useCallback(
    updatedDate => {
      const payload = {
        startDateTime: updatedDate,
      };

      if (!updatedDate) payload.startDateTimeCleared = true;

      dispatch(updatePartialWorkflow(identifier, payload));
    },
    [dispatch, identifier],
  );

  return (
    <TaskItemPopover
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
      <Tooltip
        placement="top"
        title={startDateTime ? 'Edit start date' : 'Add start date'}
      >
        {startDateTime ? (
          <DateLabel date={startDateTime} />
        ) : (
          <div>
            <TaskIcon type="calendar" isHovered={isHovered} />
          </div>
        )}
      </Tooltip>
    </TaskItemPopover>
  );
};

export default TaskTemplateStartDate;
