import { Add } from '@mui/icons-material';
import React, { useCallback, useRef } from 'react';
import { useToggle } from 'react-use';
import AdornedButton from 'components/common/AdornedButton/AdornedButton';
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
      <AdornedButton
        adornment={<Add />}
        onClick={() => togglePopoverOpen(true)}
        innerRef={invitePeopleButtonReference}
      >
        ADD A USER
      </AdornedButton>
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
