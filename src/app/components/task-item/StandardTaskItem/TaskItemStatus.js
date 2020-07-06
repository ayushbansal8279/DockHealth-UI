import React from 'react';
import Highlighter from 'react-highlight-words';
import palette from 'styles/palette';
import { StatusBar } from '../styled';

export const getWorkflowStatusConfig = workflowStatus => {
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

const TaskItemStatus = ({
  workflowStatus,
  labelWidth,
  isMatching,
  highlightedValue,
}) => {
  const { label, color } = getWorkflowStatusConfig(workflowStatus);
  return (
    <>
      <StatusBar color={color} />
      <span style={{ width: labelWidth }}>
        {isMatching ? (
          <Highlighter
            highlightClassName="list-highlight"
            searchWords={highlightedValue.toLowerCase().split(/\s+/)}
            autoEscape
            textToHighlight={label}
          />
        ) : (
          label
        )}
      </span>
    </>
  );
};

export default TaskItemStatus;
