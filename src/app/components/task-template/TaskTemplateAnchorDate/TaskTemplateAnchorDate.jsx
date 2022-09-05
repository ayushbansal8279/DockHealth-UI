import React, { useCallback } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { useDispatch } from 'react-redux';

const TaskTemplateAnchorDate = props => {
  const { workflow } = props;
  const { identifier, anchorDateTime } = workflow || {};
  const dispatch = useDispatch();

  const handleAnchorDateChange = useCallback(
    updatedDate => {
      const payload = {
        anchorDateTime: updatedDate,
      };

      if (!updatedDate) payload.anchorDateTimeCleared = true;

      dispatch(updatePartialWorkflow(identifier, payload));
    },
    [dispatch, identifier],
  );

  return (
    <TaskItemPopover
      content={({ closePopover }) => (
        <DueDatePicker
          taskIdentifier={identifier}
          selectedDate={anchorDateTime}
          disableRecurring
          onDateChange={handleAnchorDateChange}
          onCloseClick={closePopover}
        />
      )}
    >
      <Tooltip
        placement="top"
        title={anchorDateTime ? 'Edit anchor date' : 'Add anchor date'}
      >
        {anchorDateTime ? (
          <DateLabel date={anchorDateTime} />
        ) : (
          <div>
            <TaskIcon type="calendar" />
          </div>
        )}
      </Tooltip>
    </TaskItemPopover>
  );
};

export default TaskTemplateAnchorDate;
