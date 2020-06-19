import React, { useRef } from 'react';
import { IconButton } from '@material-ui/core';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import useBoolean from 'hooks/useBoolean';
import InvitingContent from './InviteMemberPopover.InvitingContent';
import NotInvitingContent from './InviteMemberPopover.NotInvitingContent';
import {
  AddMemberPopover,
  useAddMemberButtonStyles,
} from './InviteMemberPopover.Styled';

const InviteMemberPopover = ({
  addMemberButtonReference,
  isMemberPopoverOpen,
  closeMemberPopover,
  taskList,
  members,
  cancelInviteToTaskList,
  removeUserFromTaskList,
  inviteUserToTaskList,
  changeUserRoleForList,
}) => {
  const [isInviting, setInviting, unsetInviting] = useBoolean(false);

  const currentUser = useSelector(store => store.userState.userProfile);

  const isAdmin = currentUser?.orgUserRole === 'ADMIN';

  return (
    <AddMemberPopover
      anchorEl={addMemberButtonReference?.current}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMemberPopoverOpen}
      onClose={closeMemberPopover}
      PaperProps={{ square: true }}
    >
      {isInviting ? (
        <InvitingContent unsetInviting={unsetInviting} taskList={taskList} />
      ) : (
        <NotInvitingContent
          closeMemberPopover={closeMemberPopover}
          members={members}
          setInviting={setInviting}
          isAdmin={isAdmin}
          currentUser={currentUser}
          taskList={taskList}
          cancelInviteToTaskList={cancelInviteToTaskList}
          removeUserFromTaskList={removeUserFromTaskList}
          inviteUserToTaskList={inviteUserToTaskList}
          changeUserRoleForList={changeUserRoleForList}
        />
      )}
    </AddMemberPopover>
  );
};

export const InviteMemberButton = ({ size = 54, children }) => {
  const addMemberButtonReference = useRef(null);
  const addMemberButtonStyles = useAddMemberButtonStyles({ size });

  const [
    isMemberPopoverOpen,
    openMemberPopover,
    closeMemberPopover,
  ] = useBoolean(false);

  return (
    <>
      <div ref={addMemberButtonReference}>
        <IconButton
          className={clsx(addMemberButtonStyles.root)}
          onClick={openMemberPopover}
        >
          +
        </IconButton>
      </div>
      {children({
        isMemberPopoverOpen,
        closeMemberPopover,
        addMemberButtonReference,
      })}
    </>
  );
};

export default InviteMemberPopover;
