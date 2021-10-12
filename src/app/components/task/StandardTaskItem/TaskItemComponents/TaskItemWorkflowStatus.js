import React, { useRef } from 'react';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskWorkflowStatus from 'components/task/TaskWorkflowStatus/TaskWorkflowStatus';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Highlighter from 'react-highlight-words';
import {
  AddPlaceholder,
  StandardTaskItemCell,
  StatusName,
  StatusBar,
  StatusWrapper,
} from '../../styled';

const TaskItemWorkflowStatus = ({
  task,
  isCompletedGroup,
  updateWorkflowStatus,
  workflowStatus,
  matchWorkflowStatus,
  highlightedValue,
}) => {
  const statusNameReference = useRef(null);
  const { name, color } = workflowStatus || {};
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
        disabled={isCompletedGroup || task.status === 'COMPLETE'}
        contentWidth={280}
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
            <StatusBar color={color} />
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
