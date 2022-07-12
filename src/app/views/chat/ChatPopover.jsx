import React, { useState, useCallback } from 'react';
import { IconButton, Popover, Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ChatIcon from '@material-ui/icons/Chat';
// import ChatIcon from 'img/modals/chat';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Draggable from 'react-draggable';
import { useBoolean } from 'hooks/useBoolean';
import { CHAT_PATH } from 'routing/helpers/paths';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import Chat from './Chat';
import SelectedChannelContext from './SelectedChannelContext';
import {
  Container,
  StyledIconButton,
  HeaderContainer,
  ChatContainer,
} from './styled';

const ChatPopover = () => {
  const { name, identifier } = useSelector(userProfileSelector);
  const [open, setOpen, unsetOpen] = useBoolean(false);
  const [anchorElement, setAnchorElement] = useState(null);
  const history = useHistory();

  const [selectedChannel, setSelectedChannel] = useState(null);
  const value = { selectedChannel, setSelectedChannel };

  const handleClick = event => {
    setOpen();
    setAnchorElement(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    unsetOpen();
    setAnchorElement(null);
  }, [unsetOpen]);

  const handleLeaveIconClick = useCallback(() => {
    unsetOpen();
    setAnchorElement(null);
    history.push(CHAT_PATH);
  }, [history, unsetOpen]);

  const id = open ? 'simple-popover' : undefined;

  const handleClickGoBack = useCallback(() => {
    setSelectedChannel(null);
  }, []);

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
          transformOrigin={{
            vertical: 50,
            horizontal: 350,
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          PaperProps={{ style: { height: '700px', width: '525px' } }}
          disableEnforceFocus
        >
          <Container>
            <HeaderContainer className="handle">
              <StyledIconButton
                onClick={
                  selectedChannel ? handleClickGoBack : handleLeaveIconClick
                }
              >
                {selectedChannel ? <ArrowBack /> : <OpenInNewIcon />}
              </StyledIconButton>
              <Box mx={0.5} />
              <StyledIconButton onClick={handleClose}>
                <CloseIcon />
              </StyledIconButton>
            </HeaderContainer>
            <ChatContainer>
              <SelectedChannelContext.Provider value={value}>
                <Chat userId={identifier} name={name} />
              </SelectedChannelContext.Provider>
            </ChatContainer>
          </Container>
        </Popover>
      </Draggable>
    </div>
  );
};

export default ChatPopover;
