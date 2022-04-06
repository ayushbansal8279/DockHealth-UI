import React from 'react';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';

import { checkIfTemplateTask } from 'helpers/task-helpers';
import { AssigneeMatchingWrapper } from '../../styled';

const TaskItemMembers = ({
  multipleAssigneesContext,
  task,
  assignedToUsers,
  handleReasignTask,
  matchAssignedTo,
  readOnly,
}) => {
  return (
    <TaskItemPopover
      disabled={readOnly}
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
          enableLazyLoading={
            task?.taskList?.listType === 'PUBLIC' ||
            task?.taskList?.listType === 'TEMPLATE'
          }
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
  );
};

export default TaskItemMembers;
