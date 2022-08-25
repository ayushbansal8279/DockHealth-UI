import React, { useState, useCallback, useEffect } from 'react';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import sendBirdSelectors from '@sendbird/uikit-react/sendBirdSelectors';
import ChatMessageIcon from './ChatImageIcon';
import { Wrapper, NewLabel } from './styled';

const ChatIcon = ({ height = 25 }) => {
  const [unreadMessageCount, setUnreadMessageCount] = useState(null);

  const context = useSendbirdStateContext();
  const sdkInstance = sendBirdSelectors.getSdk(context);

  const onTotalUnreadMessageCountUpdated = useCallback(
    count => {
      setUnreadMessageCount(count);
    },
    [setUnreadMessageCount],
  );

  const addUserEventHandler = useCallback(
    handler => {
      if (sdkInstance) {
        const handlerId = 'SendbirdChatCount';
        sdkInstance.addUserEventHandler(handlerId, handler);
        return handlerId;
      }
      return null;
    },
    [sdkInstance],
  );

  const removeUserEventHandler = useCallback(
    handlerId => {
      if (sdkInstance && sdkInstance.removeUserEventHandler) {
        sdkInstance.removeUserEventHandler(handlerId);
      }
    },
    [sdkInstance],
  );

  useEffect(() => {
    if (sdkInstance && sdkInstance.getTotalUnreadMessageCount) {
      sdkInstance
        .getTotalUnreadMessageCount()
        .then(count => setUnreadMessageCount(count));
    }
  });

  useEffect(() => {
    let handlerId;
    if (
      sdkInstance &&
      sdkInstance.userEventHandlers &&
      sdkInstance.getTotalUnreadMessageCount
    ) {
      const handler = new sdkInstance.UserEventHandler();
      handler.onTotalUnreadMessageCountUpdated = onTotalUnreadMessageCountUpdated;
      handlerId = addUserEventHandler(handler);
    }
    return () => {
      removeUserEventHandler(handlerId);
    };
  }, [
    addUserEventHandler,
    onTotalUnreadMessageCountUpdated,
    removeUserEventHandler,
    sdkInstance,
  ]);

  const isActive = unreadMessageCount > 0;

  return (
    <Wrapper isActive={isActive}>
      <ChatMessageIcon height={height || 22} />
      <NewLabel isHidden={!isActive} />
    </Wrapper>
  );
};

export default ChatIcon;
