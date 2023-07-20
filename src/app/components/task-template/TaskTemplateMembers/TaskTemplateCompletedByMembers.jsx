import React from 'react';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { AssigneeMatchingWrapper } from './styled';

const TaskTemplateCompletedByMembers = ({ workflow = {} }) => {
  const { completedBy, searchMetaData } = workflow;

  return (
    <>
      {completedBy ? (
        <>
          <AssigneeMatchingWrapper matched={searchMetaData?.matchAssignedTo} />
          <MemberGroup members={[completedBy]} />
        </>
      ) : (
        <Tooltip placement="top" title="Completed by">
          <div />
        </Tooltip>
      )}
    </>
  );
};

export default TaskTemplateCompletedByMembers;
