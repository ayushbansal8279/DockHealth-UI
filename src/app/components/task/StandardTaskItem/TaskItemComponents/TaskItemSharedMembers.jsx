import React from 'react';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import SharedMembersList from 'components/task/MultiAssignPopover/SharedMembersList';

import { checkIfTemplateTask } from 'helpers/task-helpers';
import { AssigneeMatchingWrapper } from '../../styled';

const TaskItemSharedMembers = ({
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
        <SharedMembersList
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
          {matchAssignedTo && (
            <AssigneeMatchingWrapper matched={matchAssignedTo} />
          )}
          <MemberGroup members={assignedToUsers} />
        </>
      ) : (
        <Tooltip placement="top" title="Shared with">
          <div>{!readOnly && <AssignMemberIcon />}</div>
        </Tooltip>
      )}
    </TaskItemPopover>
  );
};

export default TaskItemSharedMembers;
