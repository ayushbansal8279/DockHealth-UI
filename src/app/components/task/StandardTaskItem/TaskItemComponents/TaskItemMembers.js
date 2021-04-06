import React from 'react';
import AssignMemberIcon from 'components/members/AssignMemberIcon/AssingMemberIcon';
import MultiAssignPopover from 'components/task/MultiAssignPopover/MultiAssignPopover';
import MemberGroup from 'components/members/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';

import { StandardTaskItemCell, AssigneeMatchingWrapper } from '../../styled';

const TaskItemMembers = ({
  multipleAssigneesContext,
  task,
  assignedToUsers,
  handleReasignTask,
  matchAssignedTo,
}) => {
  return (
    <StandardTaskItemCell
      width={`${multipleAssigneesContext ? 90 : 60}px`}
      justify={multipleAssigneesContext ? 'flex-start' : 'center'}
      paddingLeft="small"
      paddingRight="small"
      onContextMenu={event => {
        event.stopPropagation();
      }}
    >
      <MultiAssignPopover
        fullWidth={multipleAssigneesContext}
        taskListIdentifiers={task?.taskList?.taskListIdentifier}
        selectedMembers={assignedToUsers}
        onSelect={handleReasignTask}
      >
        {assignedToUsers?.length ? (
          <>
            <AssigneeMatchingWrapper matched={matchAssignedTo} />
            <MemberGroup members={assignedToUsers} />
          </>
        ) : (
          <Tooltip placement="top" title="Assign to">
            <AssignMemberIcon />
          </Tooltip>
        )}
      </MultiAssignPopover>
    </StandardTaskItemCell>
  );
};

export default TaskItemMembers;
