import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { CHAT_PATH } from 'routing/helpers/paths';
import { userProfileSelector } from 'selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';
import { selectedChatChannelSelector } from 'selectors/sendbird-selectors';
import { closePopover, openPopover } from 'actions/sendbird-actions';
import Chat from './Chat';
import ShowSettingsContext from './ShowSettingsContext';
import {
  Container,
  StyledIconButton,
  HeaderContainer,
  ChatContainer,
  ChatHeaderTitle,
} from './styled';

const ChatPopover = () => {
  const { name, identifier } = useSelector(userProfileSelector);
  const selectedChannel = useSelector(selectedChatChannelSelector);
  const dispatch = useDispatch();

  const [showSettings, setShowSettings] = useState(false);
  const showSettingsValue = useMemo(() => ({ showSettings, setShowSettings }), [
    showSettings,
    setShowSettings,
  ]);

  const handleClose = useCallback(() => {
    dispatch(closePopover(selectedChannel));
  }, [dispatch, selectedChannel]);

  const handleLeaveIconClick = useCallback(() => {
    dispatch(closePopover(null));
    window.open(`${window.location.origin.toString()}/#${CHAT_PATH}`, '_blank');
  }, [dispatch]);

  const handleClickGoBack = useCallback(() => {
    if (showSettings === true) {
      setShowSettings(false);
    } else {
      dispatch(openPopover(null));
    }
  }, [dispatch, showSettings]);

  const [containerPosition, setContainerPosition] = useState({ x: -300, y: 0 });
  const [containerSize, setContainerSize] = useState({
    width: 550,
    height: 750,
  });

  return (
    <div style={{ right: 0, top: 0 }}>
      <Rnd
        size={{ width: containerSize.width, height: containerSize.height }}
        position={{ x: containerPosition.x, y: containerPosition.y }}
        onDragStop={(_event, d) => {
          setContainerPosition({ x: d.x, y: d.y });
        }}
        minWidth="400px"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onResizeStop={(_event, direction, reference, _delta, _position) => {
          setContainerSize({
            width: reference.style.width,
            height: reference.style.height,
          });
        }}
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
            <ShowSettingsContext.Provider value={showSettingsValue}>
              <Chat userId={identifier} name={name} />
            </ShowSettingsContext.Provider>
          </ChatContainer>
        </Container>
      </Rnd>
    </div>
  );
};

export default ChatPopover;
