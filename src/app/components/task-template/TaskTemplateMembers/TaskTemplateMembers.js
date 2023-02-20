import React, { useCallback } from 'react';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';
import pluck from 'ramda/src/pluck';
import { AssigneeMatchingWrapper } from './styled';

const TaskTemplateMembers = ({
  multipleAssigneesContext,
  workflow = {},
  onWorkflowUpdate,
  readOnly,
}) => {
  const {
    assignedToUsers = [],
    searchMetaData,
    identifier,
    taskListIdentifier,
  } = workflow;

  const handleWorkflowUpdate = useCallback(
    selectedMembers => {
      onWorkflowUpdate(identifier, {
        assignedToUsers: selectedMembers,
        assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
      });
    },
    [identifier, onWorkflowUpdate],
  );

  return (
    <TaskItemPopover
      disabled={readOnly}
      contentWidth={230}
      content={({ closePopover }) => (
        <MultiAssignMembersList
          taskListIdentifiers={taskListIdentifier}
          selectedMembers={assignedToUsers}
          onSelect={handleWorkflowUpdate}
          onError={closePopover}
          enableLazyLoading={
            workflow?.taskList?.listType === 'PUBLIC' ||
            workflow?.taskList?.listType === 'TEMPLATE'
          }
        />
      )}
      fullWidth={multipleAssigneesContext}
    >
      {assignedToUsers?.length ? (
        <>
          <AssigneeMatchingWrapper matched={searchMetaData?.matchAssignedTo} />
          <MemberGroup members={assignedToUsers} />
        </>
      ) : (
        <Tooltip placement="top" title="Assign to">
          <div>
            <AssignMemberIcon />
          </div>
        </Tooltip>
      )}
    </TaskItemPopover>
  );
};

export default TaskTemplateMembers;
