import React from 'react';
import StatusIcon from 'img/bulk-edit/StatusIcon';
import TaskWorkflowStatus from 'components/task/TaskWorkflowStatus/TaskWorkflowStatus';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import { WrapperContainer, IconBox } from './styled';

const BulkEditWorkflowStatusOption = ({
  handleChangeWorkflowStatusTasks,
  isDisabled,
}) => (
  <TaskItemPopover
    placement="top"
    contentWidth={280}
    content={({ closePopover }) => (
      <TaskWorkflowStatus
        updateWorkflowStatus={workflowStatus =>
          handleChangeWorkflowStatusTasks(workflowStatus)
        }
        isDisabled={isDisabled}
        onClose={closePopover}
      />
    )}
  >
    <WrapperContainer disabled={isDisabled}>
      <IconBox>
        <StatusIcon />
      </IconBox>
      <p>Status</p>
    </WrapperContainer>
  </TaskItemPopover>
);

export default BulkEditWorkflowStatusOption;
