import React, { useRef } from 'react';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';

import { checkIfTemplateTask } from 'helpers/task-helpers';
import {
  AssigneeContainer,
  AssigneeMatchingWrapper,
  AssigneeWrapper,
} from '../../styled';

const TaskItemMembers = ({
  multipleAssigneesContext,
  task,
  assignedToUsers,
  handleReasignTask,
  matchAssignedTo,
  readOnly,
  additionalUsers,
}) => {
  const assigneeRef = useRef(null);
  return (
    <AssigneeContainer>
      <TaskItemPopover
        reference={assigneeRef}
        disabled={readOnly}
        contentWidth={246}
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
            closeModel={closePopover}
            additionalMembers={additionalUsers}
          />
        )}
        fullWidth={multipleAssigneesContext}
      >
        <div ref={assigneeRef} style={{ minWidth: '100px' }}>
          {assignedToUsers?.length ? (
            <>
              {matchAssignedTo && (
                <AssigneeMatchingWrapper matched={matchAssignedTo} />
              )}
              <MemberGroup members={assignedToUsers} size={28} />
            </>
          ) : (
            <>
              <AssigneeWrapper>
                <Tooltip placement="top" title="Add assignee">
                  <div style={{ display: 'flex', marginLeft: '2px' }}>
                    {!readOnly && <AssignMemberIcon />}
                  </div>
                </Tooltip>
              </AssigneeWrapper>
            </>
          )}
        </div>
      </TaskItemPopover>
    </AssigneeContainer>
  );
};

export default TaskItemMembers;
