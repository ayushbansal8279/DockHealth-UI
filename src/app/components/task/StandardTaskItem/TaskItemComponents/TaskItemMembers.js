import React from 'react';
import AssignMemberIcon from 'components/members/AssignMemberIcon/AssingMemberIcon';
import MemberGroup from 'components/members/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';

import { checkIfTemplateTask } from 'helpers/task-helpers';
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
      <TaskItemPopover
        contentWidth={230}
        content={({ closePopover }) => (
          <MultiAssignMembersList
            taskListIdentifiers={
              !checkIfTemplateTask(task)
                ? task?.taskList?.taskListIdentifier
                : null
            }
            selectedMembers={assignedToUsers}
            onSelect={handleReasignTask}
            onError={closePopover}
          />
        )}
        fullWidth={multipleAssigneesContext}
      >
        {assignedToUsers?.length ? (
          <>
            <AssigneeMatchingWrapper matched={matchAssignedTo} />
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
    </StandardTaskItemCell>
  );
};

export default TaskItemMembers;
