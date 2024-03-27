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
  sharedWithUsers,
  handleSharingTask,
  matchAssignedTo,
  readOnly,
  isHover,
}) => {
  return (
    <TaskItemPopover
      disabled={readOnly}
      contentWidth={230}
      content={({ closePopover }) => (
        <SharedMembersList
          task={task}
          taskListIdentifiers={
            !checkIfTemplateTask(task)
              ? task?.taskList?.taskListIdentifier
              : null
          }
          selectedMembers={sharedWithUsers}
          onSelect={handleSharingTask}
          onError={closePopover}
          enableLazyLoading={
            task?.taskList?.listType === 'PUBLIC' ||
            task?.taskList?.listType === 'TEMPLATE'
          }
        />
      )}
      fullWidth={multipleAssigneesContext}
    >
      {sharedWithUsers?.length ? (
        <>
          {matchAssignedTo && (
            <AssigneeMatchingWrapper matched={matchAssignedTo} />
          )}
          <MemberGroup members={sharedWithUsers} />
        </>
      ) : (
        <>
          {isHover ? (
            <Tooltip placement="top" title="Shared with">
              <div style={{ marginLeft: '2px' }}>
                {!readOnly && <AssignMemberIcon />}
              </div>
            </Tooltip>
          ) : (
            ''
          )}
        </>
      )}
    </TaskItemPopover>
  );
};

export default TaskItemSharedMembers;
