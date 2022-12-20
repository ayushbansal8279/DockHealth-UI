import React from 'react';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { AssigneeMatchingWrapper } from './styled';

const TaskTemplateCreatedByMembers = ({ workflow = {}, assignedToUsers }) => {
  const { searchMetaData } = workflow;

  return (
    <>
      {assignedToUsers?.length > 0 ? (
        <>
          <AssigneeMatchingWrapper matched={searchMetaData?.matchAssignedTo} />
          <MemberGroup members={assignedToUsers} />
        </>
      ) : (
        <Tooltip placement="top" title="Assign to">
          <div />
        </Tooltip>
      )}
    </>
  );
};

export default TaskTemplateCreatedByMembers;
