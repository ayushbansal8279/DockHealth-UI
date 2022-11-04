/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable func-names */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import isEmpty from 'ramda/src/isEmpty';
import { initializePusher } from 'helpers/pusher-instance';
import { getActivityAlertDetails } from 'api/activity-alerts-api';
import ShipBellSound from 'components/../sounds/ship_bell.mp3';
import ActivityAlertsToast from './ActivityAlertsToast/ActivityAlertsToast';
import { ActivityAlertsToastsContainer } from './styled';

const listenRealTimeAlerts = (currentUser, showAlert, audio) => {
  if (!currentUser || !currentUser.userIdentifier) {
    return;
  }

  const currentUserIdentifier = currentUser.userIdentifier;
  const channelName = `private-dock-user-channel-${currentUserIdentifier}`;

  const pusher = initializePusher();
  let channel = pusher?.channel(channelName);
  if (!channel || !channel.subscribed) {
    channel = pusher?.subscribe(channelName);
  }
  if (channel) {
    channel.unbind('activity-alert');
    channel.bind('activity-alert', ({ alert }) => {
      if (alert) {
        sessionStorage.setItem('hasUnreadAlerts', true);
        showAlert(alert);
        audio.play();
      }
    });
  }
};

const ActivityAlertsToasts = () => {
  const [alertsList, setAlertsList] = useState([]);
  const [newAlert, setNewAlert] = useState({});
  const [lastElement, setLastElement] = useState(null);

  const [audio] = useState(new Audio(ShipBellSound));

  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));

  const showActivityAlert = async alert => {
    const alertDetails = await getActivityAlertDetails(
      alert.activityAlertIdentifier,
    );
    setNewAlert(alertDetails);
  };

  useEffect(() => {
    listenRealTimeAlerts(currentUser, showActivityAlert, audio);
  }, [currentUser, audio]);

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
            <ActivityAlertsToast
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              itemAlert={item}
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

export default ActivityAlertsToasts;
