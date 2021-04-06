import React from 'react';
import TaskWorkflowStatus from 'components/tasklist/TaskWorkflowStatus/TaskWorkflowStatus';
import TaskItemStatus from '../TaskItemStatus';
import { AddPlaceholder, StandardTaskItemCell, InfoText } from '../../styled';

const TaskItemWorkflowStatus = ({
  task,
  isCompletedGroup,
  updateWorkflowStatus,
  workflowStatus,
  matchWorkflowStatus,
  highlightedValue,
}) => {
  return (
    <StandardTaskItemCell
      width="120px"
      paddingLeft="smallPlus"
      paddingRight="tiny"
      onContextMenu={event => {
        event.stopPropagation();
      }}
    >
      <TaskWorkflowStatus
        task={task}
        isCompletedGroup={isCompletedGroup}
        updateWorkflowStatus={updateWorkflowStatus}
      >
        {task.status === 'COMPLETE' && <InfoText>Completed</InfoText>}
        {task.status !== 'COMPLETE' && workflowStatus && (
          <TaskItemStatus
            workflowStatus={workflowStatus}
            isMatching={matchWorkflowStatus}
            highlightedValue={highlightedValue}
            labelWidth="100px"
          />
        )}
        {task.status !== 'COMPLETE' && !workflowStatus && (
          <AddPlaceholder>+ Add Status</AddPlaceholder>
        )}
      </TaskWorkflowStatus>
    </StandardTaskItemCell>
  );
};

export default TaskItemWorkflowStatus;
