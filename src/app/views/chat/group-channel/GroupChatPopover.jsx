import React, { useCallback, useState } from 'react';
import { IconButton, Popover } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import Draggable from 'react-draggable';
import { useBoolean } from 'hooks/useBoolean';
import GroupChannelContainer from 'views/chat/group-channel/GroupChannelContainer';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';

const GroupChatPopover = props => {
  const { channelUrl } = props;
  const { name, identifier } = useSelector(userProfileSelector);
  const [open, setOpen, unsetOpen] = useBoolean(false);
  const [anchorElement, setAnchorElement] = useState(null);

  const handleClick = event => {
    setOpen();
    setAnchorElement(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    unsetOpen();
    setAnchorElement(null);
  }, [unsetOpen]);

  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        <ChatIcon />
      </IconButton>
      <Draggable handle=".handle">
        <Popover
          id={id}
          open={open}
          anchorEl={anchorElement}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 50,
            horizontal: 600,
          }}
          onClose={handleClose}
        >
          <GroupChannelContainer
            identifier={identifier}
            name={name}
            channelUrl={channelUrl}
          />
        </Popover>
      </Draggable>
    </div>
  );
};

export default GroupChatPopover;
