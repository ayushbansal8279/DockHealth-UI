import React, { useRef, useState } from 'react';
import { StyledPopover } from './styled';
import MembersList from './MembersList';
import MembersForList from './MembersForList';

const TaskAssignMember = ({
  children,
  currentUser,
  task,
  reassignTask,
  isCompletedGroup,
}) => {
  const assignMemberButtonReference = useRef(null);
  const [isOpen, openPopover] = useState(false);

  const handleReasigningTask = (taskIdentifier, userId, taskListIdentifier) => {
    reassignTask(taskIdentifier, userId, taskListIdentifier);
    openPopover(false);
  };

  return (
    <>
      <div
        onClick={() => {
          if (!isCompletedGroup) openPopover(true);
        }}
        ref={assignMemberButtonReference}
      >
        {children}
      </div>
      <StyledPopover
        anchorEl={assignMemberButtonReference?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isOpen}
        onClose={() => openPopover(false)}
      >
        <>
          {isOpen && (
            <MembersForList
              component={MembersList}
              task={task}
              reassignTask={handleReasigningTask}
              currentUser={currentUser}
            />
          )}
        </>
      </StyledPopover>
    </>
  );
};
export default TaskAssignMember;
