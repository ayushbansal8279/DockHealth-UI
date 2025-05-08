import React, { useCallback, useRef } from 'react';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';
import pluck from 'ramda/src/pluck';
import {
  AssigneeMatchingWrapper,
  AssigneeContainer,
  AssigneeWrapper,
} from './styled';

const TaskTemplateMembers = ({
  multipleAssigneesContext,
  workflow = {},
  onWorkflowUpdate,
  readOnly,
  maxIconDisplay,
  isBorderColumnItem,
}) => {
  const {
    assignedToUsers = [],
    searchMetaData,
    identifier,
    taskListIdentifier,
  } = workflow;
  const assigneeRef = useRef(null);

  const handleWorkflowUpdate = useCallback(
    (selectedMembers) => {
      onWorkflowUpdate(identifier, {
        assignedToUsers: selectedMembers,
        assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
      });
    },
    [identifier, onWorkflowUpdate],
  );

  return (
    <AssigneeContainer>
      <TaskItemPopover
        reference={assigneeRef}
        disabled={readOnly}
        contentWidth={246}
        content={({ closePopover }) => (
          <MultiAssignMembersList
            taskListIdentifiers={taskListIdentifier}
            selectedMembers={assignedToUsers}
            onSelect={handleWorkflowUpdate}
            onError={closePopover}
            closeModel={closePopover}
            enableLazyLoading={
              workflow?.taskList?.listType === 'PUBLIC' ||
              workflow?.taskList?.listType === 'TEMPLATE'
            }
          />
        )}
        fullWidth={multipleAssigneesContext}
      >
        <div ref={assigneeRef} style={{ minWidth: '100px' }}>
          {assignedToUsers?.length ? (
            <>
              {searchMetaData?.matchAssignedTo && (
                <AssigneeMatchingWrapper
                  matched={searchMetaData?.matchAssignedTo}
                />
              )}

              <MemberGroup
                members={assignedToUsers}
                size={28}
                max={maxIconDisplay}
              />
            </>
          ) : (
            <>
              <AssigneeWrapper isBorderColumnItem={isBorderColumnItem}>
                <Tooltip placement="top" title="Add assignee">
                  <div style={{ display: 'flex', marginLeft: '2px' }}>
                    {!readOnly && <AssignMemberIcon />}
                  </div>
                </Tooltip>
              </AssigneeWrapper>
            </>
          )}
        </div>
      </TaskItemPopover>
    </AssigneeContainer>
  );
};

export default TaskTemplateMembers;
