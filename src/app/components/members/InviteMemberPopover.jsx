import React from 'react';
import { IconButton } from '@material-ui/core';
import { openModal } from 'modal/actions';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
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

export const InviteMemberButton = ({ size = 54, refreshMembers, list }) => {
  const dispatch = useDispatch();

  const addMemberButtonStyles = useAddMemberButtonStyles({ size });

  return (
    <>
      <div>
        <IconButton
          className={clsx(addMemberButtonStyles.root)}
          onClick={() =>
            dispatch(
              openModal('InviteToList', {
                list,
                onMembersRefresh: refreshMembers,
              }),
            )
          }
        >
          +
        </IconButton>
      </div>
    </>
  );
};

export default InviteMemberPopover;
