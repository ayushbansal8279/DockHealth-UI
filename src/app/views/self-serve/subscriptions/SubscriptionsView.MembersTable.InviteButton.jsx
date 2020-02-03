import React, { useRef, useCallback } from 'react';
import { useToggle } from 'react-use';
import InvitePeoplePopover from '../../PeopleView.InvitePeoplePopover';
import { StyledButton } from './SubscriptionsView.Styled';

const InviteButton = ({ fullWidth }) => {
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
      <StyledButton
        fullWidth={fullWidth}
        variant="contained"
        onClick={() => togglePopoverOpen(true)}
      >
        <div ref={invitePeopleButtonReference}>+ Add user to organization</div>
      </StyledButton>
      <InvitePeoplePopover
        open={isPopoverOpen}
        toggleInvitePopover={toggleInvitePopover}
        anchor={invitePeopleButtonReference.current}
      />
    </>
  );
};

export default InviteButton;
