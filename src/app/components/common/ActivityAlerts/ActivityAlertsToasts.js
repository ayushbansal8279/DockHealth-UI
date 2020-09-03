/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable func-names */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'ramda';
import pusherInstance from 'helpers/pusher-instance';
import ActivityAlertsToast from './ActivityAlertsToast/ActivityAlertsToast';
import { ActivityAlertsToastsContainer } from './styled';

const listenRealTimeAlerts = (currentUser, addAlertToList) => {
  if (!currentUser || !currentUser.userIdentifier) {
    return;
  }

  const currentUserIdentifier = currentUser.userIdentifier;
  const channelName = `dock-user-channel-${currentUserIdentifier}`;

  let channel = pusherInstance.channel(channelName);
  if (!channel) {
    channel = pusherInstance.subscribe(channelName);
  }

  channel.bind('activity-alert', ({ alert }) => {
    if (alert) {
      sessionStorage.setItem('hasUnreadAlerts', true);
      addAlertToList(alert);
    }
  });
};

const ActivityAlertsToasts = () => {
  if (!JSON.parse(sessionStorage.getItem('notificationsEnabled'))) {
    return null;
  }

  const currentUser = useSelector(store => store.userState.userProfile);

  const [alertsList, setAlertsList] = useState([]);
  const [newAlert, setNewAlert] = useState({});
  const [lastElement, setLastElement] = useState(null);

  useEffect(() => {
    listenRealTimeAlerts(currentUser, setNewAlert);
  }, [currentUser]);

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
    <ActivityAlertsToastsContainer>
      {alertsList?.map((item, idx) => (
        <ActivityAlertsToast
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
  );
};

export default ActivityAlertsToasts;
