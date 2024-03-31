import { Add } from '@mui/icons-material';
import React, { useCallback, useRef } from 'react';
import { useToggle } from 'react-use';
import AddButton from 'components/common/AddButton/AddButton';
import ToolbarButton from 'components/tasklist/ToolbarButton/ToolbarButton';
import InvitePeoplePopover from '../InvitePeoplePopover/InvitePeoplePopover';
import { AddIcon } from '@/app/views/smart-flow-builder/TaskNodeHandles/styled';

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
      {/* <AddButton
        adornment={<Add />}
        onClick={() => togglePopoverOpen(true)}
        buttonRef={invitePeopleButtonReference}
      > */}
      <ToolbarButton
        ref={invitePeopleButtonReference}
        icon={<AddIcon />}
        onClick={() => togglePopoverOpen(true)}
        isOpen={isPopoverOpen}
        active={isPopoverOpen}
        // hasPopover
      >
        <span style={{ marginLeft: '-5px' }}>Add a User</span>
      </ToolbarButton>
      {/* </AddButton> */}
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
