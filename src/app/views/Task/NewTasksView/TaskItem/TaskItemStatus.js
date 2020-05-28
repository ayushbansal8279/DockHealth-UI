import React from 'react';
import palette from 'styles/palette';
import { StatusBar } from './styled';

const getWorkflowStatusConfig = workflowStatus => {
  switch (workflowStatus) {
    case 'IN_PROGRESS':
      return { label: 'In Progress', color: palette.inProgressGreen };
    case 'PLANNED':
      return { label: 'Planned', color: palette.brightBlue };
    case 'WAITING':
      return { label: 'Waiting', color: palette.coolGrey2 };
    case 'ON_HOLD':
      return { label: 'On hold', color: palette.mediumGrey };
    case 'NO_STATUS':
      return { label: 'No status' };
    default:
      return {};
  }
};

const TaskItemStatus = ({ workflowStatus }) => {
  const { label, color } = getWorkflowStatusConfig(workflowStatus);
  return (
    <>
      <StatusBar color={color} />
      <span>{label}</span>
    </>
  );
};

export default TaskItemStatus;
