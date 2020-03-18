import { Button } from '@material-ui/core';
import React, { useCallback, useRef } from 'react';
import { useToggle } from 'react-use';
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
        size="small"
        onClick={() => togglePopoverOpen(true)}
      >
        <div style={{ whiteSpace: 'nowrap' }} ref={invitePeopleButtonReference}>
          + Add user to organization
        </div>
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
