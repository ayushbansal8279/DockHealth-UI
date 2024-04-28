import React, { useState, useRef, useCallback } from 'react';
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
    workflow,
    onWorkflowUpdate,
    // highlightedValue,
    readOnly,
  }) => {
    // const matchWorkflowStatus = workflow?.searchMetaData?.matchPatient;
    const statusNameReference = useRef(null);
    const { identifier } = workflow || {};
    // const searchWords = highlightedValue?.toLowerCase().split(/\s+/);
    const tooltipVisible =
      statusNameReference.current &&
      statusNameReference.current.offsetWidth <
        statusNameReference.current.scrollWidth;

    const [workflowStatus, setWorkflowStatus] = useState(
      workflow?.workflowStatus,
    );

    const handleWorkflowUpdate = useCallback(
      (status) => {
        const clearStatus = true;
        const donotClearStatus = false;
        setWorkflowStatus(status);
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
        <StatusSubContaioner>
          {workflowStatus ? (
            <StatusWrapper color={workflowStatus?.color}>
              <>
                {/* <StatusBar color={workflowStatus?.color} /> */}
                <Tooltip
                  title={workflowStatus?.name}
                  placement="top"
                  hideTooltip={!tooltipVisible}
                >
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
