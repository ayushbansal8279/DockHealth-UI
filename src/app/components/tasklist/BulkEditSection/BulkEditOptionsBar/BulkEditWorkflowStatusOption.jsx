import React from 'react';
import StatusIcon from 'img/bulk-edit/StatusIcon';
import TaskWorkflowStatus from 'components/tasklist/TaskWorkflowStatus/TaskWorkflowStatus';
import { WrapperContainer, IconBox } from './styled';

const BulkEditWorkflowStatusOption = ({
  handleChangeWorkflowStatusTasks,
  isDisabled,
}) => (
  <TaskWorkflowStatus
    updateWorkflowStatus={workflowStatus =>
      handleChangeWorkflowStatusTasks(workflowStatus)
    }
    isDisabled={isDisabled}
  >
    <WrapperContainer disabled={isDisabled}>
      <IconBox>
        <StatusIcon />
      </IconBox>
      <p>Status</p>
    </WrapperContainer>
  </TaskWorkflowStatus>
);

export default BulkEditWorkflowStatusOption;
