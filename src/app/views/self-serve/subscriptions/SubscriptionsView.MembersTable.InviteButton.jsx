import React, { useRef, useCallback } from 'react';
import { useToggle } from 'react-use';
import Button from '@material-ui/core/Button';
import InvitePeoplePopover from '../../PeopleView.InvitePeoplePopover';

const InviteButton = ({ fullWidth, getAllUsers }) => {
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
      <Button
        fullWidth={fullWidth}
        variant="contained"
        onClick={() => togglePopoverOpen(true)}
      >
        <div ref={invitePeopleButtonReference}>+ Add user to organization</div>
      </Button>
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
