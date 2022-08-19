/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable func-names */
import React, { useState, useEffect, useCallback } from 'react';
import { isEmpty } from 'ramda';
import { ActivityAlertsToastsContainer } from 'components/activity-alerts/styled';
import { useSendbirdStateContext } from '@sendbird/uikit-react';
import sendBirdSelectors from '@sendbird/uikit-react/sendBirdSelectors';
import ChatActivityAlertsToast from './ChatActivityAlertsToast';

const ChatActivityAlertsToasts = () => {
  const [alertsList, setAlertsList] = useState([]);
  const [newAlert, setNewAlert] = useState({});
  const [lastElement, setLastElement] = useState(null);

  const [message, setMessage] = useState(null);
  const [channel, setChannel] = useState(null);
  const context = useSendbirdStateContext();

  const sdkInstance = sendBirdSelectors.getSdk(context);

  const addGroupChannelEventHandler = useCallback(
    handler => {
      if (sdkInstance) {
        const handlerId = 'messageRecieved';
        sdkInstance.addChannelHandler(handlerId, handler);
        return handlerId;
      }
      return null;
    },
    [sdkInstance],
  );

  const removeGroupChannelEventHandler = useCallback(
    handlerId => {
      if (sdkInstance && sdkInstance.removeGroupChannelHandler) {
        sdkInstance.removeGroupChannelHandler(handlerId);
      }
    },
    [sdkInstance],
  );

  // eslint-disable-next-line no-shadow
  const onMessageRecieved = useCallback((channel, message) => {
    setMessage(message);
    setChannel(channel);
    setNewAlert({ message, channel });
  });

  useEffect(() => {
    let handlerId;

    if (sdkInstance && sdkInstance.ChannelHandler) {
      const handler = new sdkInstance.ChannelHandler();
      handler.onMessageReceived = onMessageRecieved;
      handlerId = addGroupChannelEventHandler(handler);
    }
    return () => {
      removeGroupChannelEventHandler(handlerId);
    };
  }, [sdkInstance]);

  useEffect(() => {
    if (!isEmpty(newAlert)) {
      setAlertsList([...alertsList, newAlert]);
      setNewAlert({});
    }
  }, [newAlert]);

  useEffect(() => {
    if (lastElement + 1 === alertsList?.length) {
      setAlertsList([]);
    }
  }, [lastElement]);

  return (
    <>
      {alertsList.length !== 0 && (
        <ActivityAlertsToastsContainer>
          {alertsList?.map((item, idx) => (
            <ChatActivityAlertsToast
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              itemAlert={item}
              message={message}
              channel={channel}
              positionInQueue={idx + 1}
              isLastAlert={alertsList?.length === idx + 1}
              onClear={() => {
                setLastElement(idx);
              }}
              clearAlertList={() => alertsList([])}
            />
          ))}
        </ActivityAlertsToastsContainer>
      )}
    </>
  );
};

export default ChatActivityAlertsToasts;
