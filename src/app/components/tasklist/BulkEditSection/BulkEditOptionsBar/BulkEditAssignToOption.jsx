import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import MembersList from '../../TaskAssignMember/MembersList';
import { StyledPopover } from '../../TaskAssignMember/styled';
import { IconButton, IconBox, AssigneeIcon } from './styled';

const BulkEditAssignToOption = ({
  handleChangeAssigneTasks,
  taskListIdentifier,
  isDisabled,
}) => {
  const assignMemberButtonReference = useRef(null);
  const [isOpen, openPopover] = useState(false);

  const currentUser = useSelector(store => store.userState.userProfile);

  const handleReasigningTask = (_, { userIdentifier }) => {
    handleChangeAssigneTasks(userIdentifier);
    openPopover(false);
  };

  return (
    <>
      <IconButton
        type="button"
        onClick={event => {
          event.stopPropagation();
          openPopover(true);
        }}
        ref={assignMemberButtonReference}
        disabled={isDisabled}
      >
        <IconBox>
          <AssigneeIcon />
        </IconBox>
        <p>Assignee</p>
      </IconButton>
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
        onClose={event => {
          event.stopPropagation();
          openPopover(false);
        }}
      >
        <>
          {isOpen && (
            <MembersList
              reassignTask={handleReasigningTask}
              currentUser={currentUser}
              taskListIdentifier={taskListIdentifier}
            />
          )}
        </>
      </StyledPopover>
    </>
  );
};
export default BulkEditAssignToOption;
