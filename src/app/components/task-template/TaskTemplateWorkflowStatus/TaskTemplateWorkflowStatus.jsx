import React, { useRef, useCallback } from 'react';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskWorkflowStatus from 'components/task/TaskWorkflowStatus/TaskWorkflowStatus';
import Tooltip from 'components/common/Tooltip/Tooltip';
// import Highlighter from 'react-highlight-words';
import {
  AddPlaceholder,
  StatusName,
  StatusWrapper,
  StatusSubContaioner,
} from './styled';

const TaskTemplateWorkflowStatus = React.memo(
  ({
    workflowStatus,
    onWorkflowUpdate,
    // highlightedValue,
    readOnly,
  }) => {
    // const matchWorkflowStatus = workflow?.searchMetaData?.matchPatient;
    const statusNameReference = useRef(null);
    // const searchWords = highlightedValue?.toLowerCase().split(/\s+/);
    const tooltipVisible =
      statusNameReference.current &&
      statusNameReference.current.offsetWidth <
        statusNameReference.current.scrollWidth;

    const handleWorkflowUpdate = useCallback(
      (status) => {
        const clearStatus = true;
        const donotClearStatus = false;
        // setWorkflowStatus(status);
        onWorkflowUpdate({
          workflowStatusIdentifier: status?.identifier,
          workflowStatusCleared: status ? donotClearStatus : clearStatus,
        });
      },
      [onWorkflowUpdate],
    );

    return (
      <TaskItemPopover
        fullWidth
        content={({ closePopover, resetPosition }) => (
          <TaskWorkflowStatus
            selectedStatusIdentifier={workflowStatus?.identifier}
            updateWorkflowStatus={handleWorkflowUpdate}
            onClose={closePopover}
            onWidthChange={resetPosition}
          />
        )}
        disabled={readOnly}
      >
        <StatusSubContaioner>
          {workflowStatus ? (
            <StatusWrapper color={workflowStatus?.color}>
              <>
                <Tooltip title={workflowStatus?.name} placement="top">
                  <StatusName ref={statusNameReference}>
                    {workflowStatus?.name}
                  </StatusName>
                </Tooltip>
              </>
            </StatusWrapper>
          ) : (
            <AddPlaceholder className="addPlaceholder">
              + Add Status
            </AddPlaceholder>
          )}
        </StatusSubContaioner>
      </TaskItemPopover>
    );
  },
);

export default TaskTemplateWorkflowStatus;
