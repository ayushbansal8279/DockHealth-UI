import { IconButton } from '@material-ui/core';
import clsx from 'clsx';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import useBoolean from '../../hooks/useBoolean';
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
  membersNotInTaskList,
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
          membersNotInTaskList={membersNotInTaskList}
          setInviting={setInviting}
          isAdmin={isAdmin}
          currentUser={currentUser}
          taskList={taskList}
        />
      )}
    </AddMemberPopover>
  );
};

export const InviteMemberPopoverWithButton = ({
  size = 54,
  taskList,
  members,
  membersNotInTaskList,
}) => {
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
      <InviteMemberPopover
        addMemberButtonReference={addMemberButtonReference}
        isMemberPopoverOpen={isMemberPopoverOpen}
        closeMemberPopover={closeMemberPopover}
        taskList={taskList}
        members={members}
        membersNotInTaskList={membersNotInTaskList}
      />
    </>
  );
};

export default InviteMemberPopover;
