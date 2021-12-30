import React, { useRef } from 'react';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskWorkflowStatus from 'components/task/TaskWorkflowStatus/TaskWorkflowStatus';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Highlighter from 'react-highlight-words';
import {
  AddPlaceholder,
  StandardTaskItemCell,
  StatusName,
  StatusWrapper,
} from '../../styled';

const TaskItemWorkflowStatus = ({
  task,
  updateWorkflowStatus,
  workflowStatus,
  matchWorkflowStatus,
  highlightedValue,
}) => {
  const statusNameReference = useRef(null);
  const { name } = workflowStatus || {};
  const searchWords = highlightedValue?.toLowerCase().split(/\s+/);
  const tooltipVisible =
    statusNameReference.current &&
    statusNameReference.current.offsetWidth <
      statusNameReference.current.scrollWidth;

  return (
    <StandardTaskItemCell
      width="120px"
      paddingLeft="smallPlus"
      paddingRight="tiny"
      onContextMenu={event => {
        event.stopPropagation();
      }}
    >
      <TaskItemPopover
        fullWidth
        content={({ closePopover, resetPosition }) => (
          <TaskWorkflowStatus
            selectedStatusIdentifier={task.workflowStatus?.identifier}
            updateWorkflowStatus={updateWorkflowStatus}
            onClose={closePopover}
            onWidthChange={resetPosition}
          />
        )}
      >
        {workflowStatus ? (
          <StatusWrapper>
            <Tooltip title={name} placement="top" hideTooltip={!tooltipVisible}>
              <StatusName ref={statusNameReference}>
                {matchWorkflowStatus ? (
                  <Highlighter
                    highlightClassName="list-highlight"
                    searchWords={searchWords}
                    autoEscape
                    textToHighlight={name}
                  />
                ) : (
                  name
                )}
              </StatusName>
            </Tooltip>
          </StatusWrapper>
        ) : (
          <AddPlaceholder>+ Add Status</AddPlaceholder>
        )}
      </TaskItemPopover>
    </StandardTaskItemCell>
  );
};

export default TaskItemWorkflowStatus;
