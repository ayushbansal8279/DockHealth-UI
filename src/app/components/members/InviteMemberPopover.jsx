import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import useBoolean from '../../hooks/useBoolean';
import InvitingContent from './InviteMemberPopover.InvitingContent';
import NotInvitingContent from './InviteMemberPopover.NotInvitingContent';
import {
  AddMemberButton,
  AddMemberPopover,
} from './InviteMemberPopover.Styled';

const InviteMemberPopover = ({ taskList, members }) => {
  const addMemberButtonReference = useRef(null);

  const [isInviting, setInviting, unsetInviting] = useBoolean(false);

  const currentUser = useSelector(store => store.userState.userProfile);

  const isAdmin = currentUser?.orgUserRole === 'ADMIN';

  const [
    isMemberPopoverOpen,
    openMemberPopover,
    closeMemberPopover,
  ] = useBoolean(false);

  return (
    <>
      <div ref={addMemberButtonReference}>
        <AddMemberButton onClick={openMemberPopover}>+</AddMemberButton>
      </div>
      <AddMemberPopover
        anchorEl={addMemberButtonReference.current}
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
          />
        )}
      </AddMemberPopover>
    </>
  );
};

export default InviteMemberPopover;
