import React, { useState, useCallback } from 'react';
import { Popover, Box } from '@material-ui/core';
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
import ShowSettingsContext from './ShowSettingsContext';
import {
  Container,
  StyledIconButton,
  HeaderContainer,
  ChatContainer,
  ChatHeaderTitle,
} from './styled';

const ChatPopover = ({ setShowChatPopover, openChat = true }) => {
  const { name, identifier } = useSelector(userProfileSelector);
  const [open, unsetOpen] = useBoolean(openChat);
  const [anchorElement, setAnchorElement] = useState(null);

  const [selectedChannel, setSelectedChannel] = useState(null);
  const value = { selectedChannel, setSelectedChannel, setShowChatPopover };

  const [showSettings, setShowSettings] = useState(false);
  const showSettingsValue = { showSettings, setShowSettings };

  const handleClose = useCallback(() => {
    setShowChatPopover(false);
    unsetOpen();
    setAnchorElement(null);
  }, [unsetOpen, setShowChatPopover]);

  const handleLeaveIconClick = useCallback(() => {
    unsetOpen();
    setAnchorElement(null);
    window.open(`${window.location.origin.toString()}/#${CHAT_PATH}`, '_blank');
  }, [unsetOpen]);

  const id = open ? 'simple-popover' : undefined;

  const handleClickGoBack = useCallback(() => {
    setShowChatPopover(true);
    setSelectedChannel(null);
    setShowSettings(false);
  }, [setShowChatPopover]);

  return (
    <div>
      <Draggable handle=".handle">
        <Popover
          id={id}
          open={open}
          anchorEl={anchorElement}
          anchorOrigin={{
            vertical: 50,
            horizontal: 10,
          }}
          PaperProps={{ style: { height: '700px', width: '525px' } }}
          disableEnforceFocus
          style={{ width: '550px', height: '750px' }}
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
              <ChatHeaderTitle>Dock Chat</ChatHeaderTitle>
              <Box mx={0.5} />
              <StyledIconButton onClick={handleClose}>
                <CloseIcon />
              </StyledIconButton>
            </HeaderContainer>
            <ChatContainer>
              <SelectedChannelContext.Provider value={value}>
                <ShowSettingsContext.Provider value={showSettingsValue}>
                  <Chat userId={identifier} name={name} />
                </ShowSettingsContext.Provider>
              </SelectedChannelContext.Provider>
            </ChatContainer>
          </Container>
        </Popover>
      </Draggable>
    </div>
  );
};

export default ChatPopover;
