import React, { useState, useCallback, useEffect } from 'react';
import { IconButton, Popover, Box, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import sendBirdSelectors from '@sendbird/uikit-react/sendBirdSelectors';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Draggable from 'react-draggable';
import { useBoolean } from 'hooks/useBoolean';
import { CHAT_PATH } from 'routing/helpers/paths';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Chat from './Chat';
import SelectedChannelContext from './SelectedChannelContext';
import ShowSettingsContext from './ShowSettingsContext';
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

  const [showSettings, setShowSettings] = useState(false);
  const showSettingsValue = { showSettings, setShowSettings };

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
    setShowSettings(false);
  }, []);

  const context = useSendbirdStateContext();
  const sdkInstance = sendBirdSelectors.getSdk(context);
  // const userEventHandler = sdkInstance.UserEventHandler();
  const [unreadMessageCount, setUnreadMessageCount] = useState(null);

  useEffect(() => {
    if (sdkInstance && sdkInstance.getTotalUnreadMessageCount) {
      sdkInstance
        .getTotalUnreadMessageCount()
        .then(count => setUnreadMessageCount(count));
    }
  }, [sdkInstance]);

  return (
    <div>
      <IconButton
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        <TaskIcon type="comments" isActive isNew={unreadMessageCount > 0} />
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
