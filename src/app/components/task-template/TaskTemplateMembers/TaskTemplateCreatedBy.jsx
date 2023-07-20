import React from 'react';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { AssigneeMatchingWrapper } from './styled';

const TaskTemplateCreatedByMembers = ({ workflow = {} }) => {
  const { searchMetaData, creator } = workflow;

  return (
    <>
      {creator ? (
        <>
          <AssigneeMatchingWrapper matched={searchMetaData?.matchAssignedTo} />
          <MemberGroup members={[creator]} />
        </>
      ) : (
        <Tooltip placement="top" title="Created by">
          <div />
        </Tooltip>
      )}
    </>
  );
};

export default TaskTemplateCreatedByMembers;
