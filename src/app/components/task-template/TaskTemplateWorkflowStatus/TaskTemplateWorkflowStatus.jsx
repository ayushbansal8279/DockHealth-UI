import React, { useRef, useCallback } from 'react';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskWorkflowStatus from 'components/task/TaskWorkflowStatus/TaskWorkflowStatus';
import Tooltip from 'components/common/Tooltip/Tooltip';
// import Highlighter from 'react-highlight-words';
import { AddPlaceholder, StatusName, StatusWrapper, StatusBar } from './styled';

const TaskTemplateWorkflowStatus = ({
  workflow,
  onWorkflowUpdate,
  // highlightedValue,
  readOnly,
}) => {
  // const matchWorkflowStatus = workflow?.searchMetaData?.matchPatient;
  const statusNameReference = useRef(null);
  const { workflowStatus, identifier } = workflow || {};
  const { name } = workflowStatus || {};
  // const searchWords = highlightedValue?.toLowerCase().split(/\s+/);
  const tooltipVisible =
    statusNameReference.current &&
    statusNameReference.current.offsetWidth <
      statusNameReference.current.scrollWidth;

  const handleWorkflowUpdate = useCallback(
    (status) => {
      const clearStatus = true;
      const donotClearStatus = false;
      onWorkflowUpdate(identifier, {
        workflowStatusIdentifier: status?.identifier,
        workflowStatusCleared: status ? donotClearStatus : clearStatus,
      });
    },
    [identifier, onWorkflowUpdate],
  );

  return (
    <TaskItemPopover
      fullWidth
      content={({ closePopover, resetPosition }) => (
        <TaskWorkflowStatus
          selectedStatusIdentifier={identifier}
          updateWorkflowStatus={handleWorkflowUpdate}
          onClose={closePopover}
          onWidthChange={resetPosition}
        />
      )}
      disabled={readOnly}
    >
      {workflowStatus ? (
        <StatusWrapper>
          <>
            <StatusBar color={workflowStatus?.color} />
            <Tooltip title={name} placement="top" hideTooltip={!tooltipVisible}>
              <StatusName ref={statusNameReference}>{name}</StatusName>
            </Tooltip>
          </>
        </StatusWrapper>
      ) : (
        <AddPlaceholder>+ Add Status</AddPlaceholder>
      )}
    </TaskItemPopover>
  );
};

export default TaskTemplateWorkflowStatus;
