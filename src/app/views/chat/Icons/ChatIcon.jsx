import React from 'react';
import ChatMessageIcon from './ChatImageIcon';
import { Wrapper, NewLabel } from './styled';

const ChatIcon = ({ height = 22, isActive, isNew }) => (
  <Wrapper isActive={isActive}>
    <ChatMessageIcon height={height || 22} />
    <NewLabel isHidden={!isNew || !isActive} />
  </Wrapper>
);
export default ChatIcon;
