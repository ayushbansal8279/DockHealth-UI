import React from 'react';
import StatusIcon from 'img/bulk-edit/StatusIcon';
import TaskWorkflowStatus from 'components/tasklist/TaskWorkflowStatus/TaskWorkflowStatus';
import { IconButton, IconBox } from './styled';

const BulkEditWorkflowStatusOption = ({
  handleChangeWorkflowStatusTasks,
  isDisabled,
}) => (
  <TaskWorkflowStatus
    task={{}}
    updateWorkflowStatus={(_, workflowStatus) =>
      handleChangeWorkflowStatusTasks(workflowStatus)
    }
    isDisabled={isDisabled}
  >
    <IconButton type="button" onClick={() => {}} disabled={isDisabled}>
      <IconBox>
        <StatusIcon />
      </IconBox>
      <p>Status</p>
    </IconButton>
  </TaskWorkflowStatus>
);

export default BulkEditWorkflowStatusOption;
