import { Add } from '@material-ui/icons';
import React, { useCallback, useRef } from 'react';
import { Button } from '@material-ui/core';
import { useToggle } from 'react-use';
import Spacing from 'components/common/Spacing';
import AdornedButton from 'components/common/AdornedButton';
import InvitePeoplePopover from 'views/people-list/PeopleView.InvitePeoplePopover';

const InviteButton = ({ getAllUsers, buyButtonDisabled, onClickBuyButton }) => {
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
      <Spacing horizontal={5} />
      <Button
        disabled={buyButtonDisabled}
        variant="contained"
        size="small"
        onClick={onClickBuyButton}
      >
        Buy this plan
      </Button>
    </>
  );
};

export default InviteButton;
