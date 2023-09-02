import React, { useState, useEffect, useCallback } from 'react';
import isEmpty from 'ramda/src/isEmpty';
import { ActivityAlertsToastsContainer } from 'components/activity-alerts/styled';
import { useSendbirdStateContext } from '@sendbird/uikit-react';
import GroupChannelHandler from '@sendbird/uikit-react/handlers/GroupChannelHandler';
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors';
import ShipBellSound from 'components/../sounds/ship_bell_single.mp3';
import { v4 as uuidv4 } from 'uuid';
import ChatActivityAlertsToast from './ChatActivityAlertsToast';

const ChatActivityAlertsToasts = () => {
  const [alertsList, setAlertsList] = useState([]);
  const [newAlert, setNewAlert] = useState({});
  const [lastElement, setLastElement] = useState(null);

  const [message, setMessage] = useState(null);
  const [channel, setChannel] = useState(null);
  const context = useSendbirdStateContext();

  const sdkInstance = sendbirdSelectors.getSdk(context);

  const [audio] = useState(new Audio(ShipBellSound));

  const removeGroupChannelEventHandler = useCallback(
    (handlerId) => {
      if (sdkInstance?.groupChannel?.removeChannelHandler) {
        sdkInstance.groupChannel.removeChannelHandler(handlerId);
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
      // audio.play();
    },
    [audio],
  );

  useEffect(() => {
    const uuid = uuidv4();

    if (sdkInstance?.groupChannel?.addGroupChannelHandler) {
      // eslint-disable-next-line sonarjs/prefer-object-literal
      const channelHandlerConstructor = {};
      channelHandlerConstructor.onMessageReceived = onMessageRecieved;
      const channelHandler = new GroupChannelHandler(channelHandlerConstructor);
      sdkInstance.groupChannel.addGroupChannelHandler(uuid, channelHandler);
    }
    return () => {
      removeGroupChannelEventHandler(uuid);
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
