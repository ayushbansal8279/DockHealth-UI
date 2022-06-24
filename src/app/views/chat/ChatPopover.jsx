import React, { useCallback, useState } from 'react';
import { IconButton, Popover, Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ChatIcon from '@material-ui/icons/Chat';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Draggable from 'react-draggable';
import { useBoolean } from 'hooks/useBoolean';
import { CHAT_PATH } from 'routing/helpers/paths';
import { App as SendbirdApp } from 'sendbird-uikit';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import {
  Container,
  ColorSet,
  StyledIconButton,
  HeaderContainer,
  ChatContainer,
} from './styled';

const ChatPopover = () => {
  const { name, identifier } = useSelector(userProfileSelector);
  const [open, setOpen, unsetOpen] = useBoolean(false);
  const [anchorElement, setAnchorElement] = useState(null);
  const history = useHistory();

  const appId =
    process.env.SENDBIRD_APP_ID ?? 'D11A4B11-21AD-4025-9D8C-2BCF693C814C';

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
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          PaperProps={{ style: { height: '100vh' } }}
          onClose={handleClose}
        >
          <Container>
            <HeaderContainer className="handle">
              {/* <Box display="flex"> */}
              <StyledIconButton onClick={handleLeaveIconClick}>
                <OpenInNewIcon />
              </StyledIconButton>
              <Box mx={0.5} />
              <StyledIconButton onClick={handleClose}>
                <CloseIcon />
              </StyledIconButton>
              {/* </Box> */}
            </HeaderContainer>
            <ChatContainer>
              <SendbirdApp
                appId={appId}
                userId={identifier}
                nickname={name}
                colorSet={ColorSet}
                useReaction
                useMessageGrouping
                userListQuery
              />
            </ChatContainer>
          </Container>
        </Popover>
      </Draggable>
    </div>
  );
};

export default ChatPopover;
