import React, { useRef } from 'react';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskWorkflowStatus from 'components/task/TaskWorkflowStatus/TaskWorkflowStatus';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Highlighter from 'react-highlight-words';
import {
  AddPlaceholder,
  StatusName,
  StatusWrapper,
  StatusBar,
} from '../../styled';

const TaskItemWorkflowStatus = ({
  task,
  updateWorkflowStatus,
  workflowStatus,
  matchWorkflowStatus,
  highlightedValue,
  showDefaultTaskStatusCompleted,
}) => {
  const statusNameReference = useRef(null);
  const { name } = workflowStatus || {};
  const searchWords = highlightedValue?.toLowerCase().split(/\s+/) || '-';
  const tooltipVisible =
    statusNameReference.current &&
    statusNameReference.current.offsetWidth <
      statusNameReference.current.scrollWidth;

  return (
    <>
      {task.status === 'COMPLETE' && showDefaultTaskStatusCompleted && (
        <StatusName ref={statusNameReference}>Completed</StatusName>
      )}
      {(task.status !== 'COMPLETE' || !showDefaultTaskStatusCompleted) && (
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
              {(task.status !== 'COMPLETE' ||
                !showDefaultTaskStatusCompleted) && (
                <>
                  <StatusBar color={workflowStatus?.color} />
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
            <AddPlaceholder>+ Add Status</AddPlaceholder>
          )}
        </TaskItemPopover>
      )}
    </>
  );
};

export default TaskItemWorkflowStatus;
