import React, { useState, useCallback } from 'react';
import { Popover, Box, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Draggable from 'react-draggable';
import { useBoolean } from 'hooks/useBoolean';
import { CHAT_PATH } from 'routing/helpers/paths';
import { userProfileSelector } from 'selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import {
  showChatPopoverSelector,
  selectedChatChannelSelector,
} from 'selectors/sendbird-selectors';
import { closePopover, openPopover } from 'actions/sendbird-actions';
import Chat from './Chat';
import ShowSettingsContext from './ShowSettingsContext';
import {
  Container,
  StyledIconButton,
  HeaderContainer,
  ChatContainer,
} from './styled';

const ChatPopover = () => {
  const { name, identifier } = useSelector(userProfileSelector);
  const showPopover = useSelector(showChatPopoverSelector);
  const selectedChannel = useSelector(selectedChatChannelSelector);
  const dispatch = useDispatch();

  const [open, unsetOpen] = useBoolean(showPopover);
  const [anchorElement, setAnchorElement] = useState(null);
  const history = useHistory();

  const [showSettings, setShowSettings] = useState(false);
  const showSettingsValue = { showSettings, setShowSettings };

  const handleClose = useCallback(() => {
    dispatch(closePopover());
    unsetOpen();
    setAnchorElement(null);
  }, [unsetOpen, dispatch]);

  const handleLeaveIconClick = useCallback(() => {
    unsetOpen();
    dispatch(closePopover(null));
    setAnchorElement(null);
    history.push(CHAT_PATH);
  }, [history, unsetOpen, dispatch]);

  const id = open ? 'simple-popover' : undefined;

  const handleClickGoBack = useCallback(() => {
    if (showSettings === true) {
      setShowSettings(false);
    } else {
      dispatch(openPopover(null));
    }
  }, [dispatch, showSettings]);

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
              <Typography color="white" variant="h3">
                Dock Chat
              </Typography>
              <Box mx={0.5} />
              <StyledIconButton onClick={handleClose}>
                <CloseIcon />
              </StyledIconButton>
            </HeaderContainer>
            <ChatContainer>
              <ShowSettingsContext.Provider value={showSettingsValue}>
                <Chat userId={identifier} name={name} />
              </ShowSettingsContext.Provider>
            </ChatContainer>
          </Container>
        </Popover>
      </Draggable>
    </div>
  );
};

export default ChatPopover;
