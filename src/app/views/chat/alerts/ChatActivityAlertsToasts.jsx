import React, { useState, useEffect, useCallback } from 'react';
import isEmpty from 'ramda/src/isEmpty';
import { ActivityAlertsToastsContainer } from 'components/activity-alerts/styled';
import { useSendbirdStateContext } from '@sendbird/uikit-react';
import sendBirdSelectors from '@sendbird/uikit-react/sendBirdSelectors';
import ShipBellSound from 'components/../sounds/ship_bell_single.mp3';
import ChatActivityAlertsToast from './ChatActivityAlertsToast';

const ChatActivityAlertsToasts = () => {
  const [alertsList, setAlertsList] = useState([]);
  const [newAlert, setNewAlert] = useState({});
  const [lastElement, setLastElement] = useState(null);

  const [message, setMessage] = useState(null);
  const [channel, setChannel] = useState(null);
  const context = useSendbirdStateContext();

  const sdkInstance = sendBirdSelectors.getSdk(context);

  const [audio] = useState(new Audio(ShipBellSound));

  const addGroupChannelEventHandler = useCallback(
    (handler) => {
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
    (handlerId) => {
      if (sdkInstance && sdkInstance.removeGroupChannelHandler) {
        sdkInstance.removeGroupChannelHandler(handlerId);
      }
    },
    [sdkInstance],
  );

  const onMessageRecieved = useCallback(
    // eslint-disable-next-line no-shadow
    (channel, message) => {
      setMessage(message);
      setChannel(channel);
      setNewAlert({ message, channel });
      audio.play();
    },
    [audio],
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkInstance]);

  useEffect(() => {
    if (!isEmpty(newAlert)) {
      setAlertsList([...alertsList, newAlert]);
      setNewAlert({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAlert]);

  useEffect(() => {
    if (lastElement + 1 === alertsList?.length) {
      setAlertsList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
