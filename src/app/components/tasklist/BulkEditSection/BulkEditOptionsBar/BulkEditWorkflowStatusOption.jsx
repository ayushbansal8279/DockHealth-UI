import React from 'react';
import StatusIcon from 'img/bulk-edit/StatusIcon';
import TaskWorkflowStatus from 'components/task/TaskWorkflowStatus/TaskWorkflowStatus';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import BulkEditOption from 'components/bulk-edit/BulkEditOption/BulkEditOption';

const BulkEditWorkflowStatusOption = ({
  handleChangeWorkflowStatusTasks,
  isDisabled,
}) => (
  <TaskItemPopover
    placement="top"
    contentWidth={280}
    content={({ closePopover, resetPosition }) => (
      <TaskWorkflowStatus
        updateWorkflowStatus={workflowStatus =>
          handleChangeWorkflowStatusTasks(workflowStatus)
        }
        isDisabled={isDisabled}
        onClose={closePopover}
        onWidthChange={resetPosition}
      />
    )}
  >
    <BulkEditOption
      iconComponent={StatusIcon}
      title="Status"
      isDisabled={isDisabled}
    />
  </TaskItemPopover>
);

export default BulkEditWorkflowStatusOption;
