import React from 'react';
import AssignMemberIcon from 'components/members/AssignMemberIcon/AssingMemberIcon';
import MemberGroup from 'components/members/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';

import { StandardTaskItemCell, AssigneeMatchingWrapper } from '../../styled';

const TaskItemPermissions = ({
  // template,
  assignedToUsers,
  matchAssignedTo,
}) => {
  return (
    <StandardTaskItemCell
      width={200}
      justify="flex-end"
      paddingLeft="small"
      paddingRight="small"
      onContextMenu={event => {
        event.stopPropagation();
      }}
    >
      {assignedToUsers?.length ? (
        <>
          <AssigneeMatchingWrapper matched={matchAssignedTo} />
          <MemberGroup members={assignedToUsers} />
          <AssignMemberIcon />
        </>
      ) : (
        <Tooltip placement="top" title="Grant permissions">
          <div>
            <AssignMemberIcon />
          </div>
        </Tooltip>
      )}
    </StandardTaskItemCell>
  );
};

export default TaskItemPermissions;
