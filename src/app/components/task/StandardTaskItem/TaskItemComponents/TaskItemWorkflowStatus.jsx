import React, { useRef } from 'react';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskWorkflowStatus from 'components/task/TaskWorkflowStatus/TaskWorkflowStatus';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Highlighter from 'react-highlight-words';
import {
  StatusName,
  StatusWrapper,
  StatusSubContaioner,
  PlaceholderText,
  WorkflowStatusWrapper,
  StatusContainer,
} from '../../styled';

const TaskItemWorkflowStatus = ({
  task,
  updateWorkflowStatus,
  workflowStatus,
  matchWorkflowStatus,
  highlightedValue,
  showDefaultTaskStatusCompleted,
  readOnly,
}) => {
  const statusNameReference = useRef(null);
  const { name } = workflowStatus || {};
  const searchWords = highlightedValue?.toLowerCase().split(/\s+/) || '-';
  const tooltipVisible =
    statusNameReference.current &&
    statusNameReference.current.offsetWidth <
      statusNameReference.current.scrollWidth;

  return (
    <StatusContainer>
      {task.status === 'COMPLETE' && showDefaultTaskStatusCompleted && (
        <div style={{ marginLeft: '12px' }}>
          <StatusWrapper>
            <StatusName ref={statusNameReference}>Completed</StatusName>
          </StatusWrapper>
        </div>
      )}
      {(task.status !== 'COMPLETE' || !showDefaultTaskStatusCompleted) && (
        <TaskItemPopover
          // contentWidth={160 || 'auto'}
          fullWidth
          content={({ closePopover, resetPosition }) => (
            <TaskWorkflowStatus
              selectedStatusIdentifier={task.workflowStatus?.identifier}
              updateWorkflowStatus={updateWorkflowStatus}
              onClose={closePopover}
              onWidthChange={resetPosition}
            />
          )}
          disabled={readOnly}
        >
          <StatusSubContaioner>
            {workflowStatus ? (
              <StatusWrapper color={workflowStatus?.color}>
                {(task.status !== 'COMPLETE' ||
                  !showDefaultTaskStatusCompleted) && (
                  <>
                    {/* <StatusBar color={workflowStatus?.color} /> */}
                    <Tooltip
                      title={name}
                      placement="top"
                      hideTooltip={!tooltipVisible}
                    >
                      <StatusName ref={statusNameReference}>
                        {matchWorkflowStatus ? (
                          <Highlighter
                            highlightClassName="list-highlight"
                            searchWords={
                              matchWorkflowStatus
                                ? searchWords
                                : `${name}`.toLowerCase().split(/\s+/)
                            }
                            autoEscape
                            textToHighlight={`${name}`}
                          />
                        ) : (
                          name
                        )}
                      </StatusName>
                    </Tooltip>
                  </>
                )}
              </StatusWrapper>
            ) : (
              <WorkflowStatusWrapper>
                  <Tooltip placement="top" title="Add Status">
                    <PlaceholderText>+ Add Status</PlaceholderText>
                  </Tooltip>
              </WorkflowStatusWrapper>
            )}
          </StatusSubContaioner>
        </TaskItemPopover>
      )}
    </StatusContainer>
  );
};

export default TaskItemWorkflowStatus;
