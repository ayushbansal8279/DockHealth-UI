import React, { useRef, useState } from 'react';
import { StyledPopover } from './styled';
import MembersList from './MembersList';

const TaskAssignMember = ({ children, currentUser, task, reassignTask }) => {
  const assignMemberButtonReference = useRef(null);
  const [isOpen, openPopover] = useState(false);

  const handleReasigningTask = (reassignedTask, user, taskListIdentifier) => {
    reassignTask(reassignedTask, user, taskListIdentifier);
    openPopover(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={event => {
          event.stopPropagation();
          openPopover(true);
        }}
        ref={assignMemberButtonReference}
      >
        {children}
      </button>
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
            <MembersList
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
