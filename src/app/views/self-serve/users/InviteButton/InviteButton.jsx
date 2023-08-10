import { Add } from '@mui/icons-material';
import React, { useCallback, useRef } from 'react';
import { useToggle } from 'react-use';
import AddButton from 'components/common/AddButton/AddButton';
import InvitePeoplePopover from '../InvitePeoplePopover/InvitePeoplePopover';

const InviteButton = ({ getAllUsers }) => {
  const invitePeopleButtonReference = useRef(null);
  const [isPopoverOpen, togglePopoverOpen] = useToggle(false);

  const toggleInvitePopover = useCallback(
    ({ newInvitePopoverState } = {}) => {
      togglePopoverOpen(newInvitePopoverState ?? !isPopoverOpen);
    },
    [isPopoverOpen, togglePopoverOpen],
  );

  return (
    <>
      <AddButton
        adornment={<Add />}
        onClick={() => togglePopoverOpen(true)}
        buttonRef={invitePeopleButtonReference}
      >
        ADD A USER
      </AddButton>
      <InvitePeoplePopover
        open={isPopoverOpen}
        toggleInvitePopover={toggleInvitePopover}
        anchor={invitePeopleButtonReference.current}
        getAllUsers={getAllUsers}
      />
    </>
  );
};

export default InviteButton;
