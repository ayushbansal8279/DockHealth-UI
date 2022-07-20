import React, { useState, useCallback } from 'react';
import { IconButton, Popover, Box, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ChatIcon from '@material-ui/icons/Chat';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Draggable from 'react-draggable';
import { useBoolean } from 'hooks/useBoolean';
import { CHAT_PATH } from 'routing/helpers/paths';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import SBProvider from '@sendbird/uikit-react/SendbirdProvider';
import Chat from './Chat';
import SelectedChannelContext from './SelectedChannelContext';
import {
  Container,
  StyledIconButton,
  HeaderContainer,
  ChatContainer,
  ColorSet,
} from './styled';

const ChatPopover = () => {
  const { name, identifier } = useSelector(userProfileSelector);
  const [open, setOpen, unsetOpen] = useBoolean(false);
  const [anchorElement, setAnchorElement] = useState(null);
  const history = useHistory();

  const appId =
    process.env.SENDBIRD_APP_ID ?? 'D11A4B11-21AD-4025-9D8C-2BCF693C814C';

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
              <Typography color="white" variant="h3">
                Chat
              </Typography>
              <Box mx={0.5} />
              <StyledIconButton onClick={handleClose}>
                <CloseIcon />
              </StyledIconButton>
            </HeaderContainer>
            <ChatContainer>
              <SelectedChannelContext.Provider value={value}>
                <SBProvider
                  appId={appId}
                  userId={identifier}
                  nickname={name}
                  colorSet={ColorSet}
                >
                  <Chat userId={identifier} name={name} />
                </SBProvider>
              </SelectedChannelContext.Provider>
            </ChatContainer>
          </Container>
        </Popover>
      </Draggable>
    </div>
  );
};

export default ChatPopover;
