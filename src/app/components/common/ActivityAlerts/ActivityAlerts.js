/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable sonarjs/no-duplicated-branches */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BlueBellIcon from 'img/notifications/blue-bell';
import NewBlueBellIcon from 'img/notifications/new-blue-bell';
import WhiteBellIcon from 'img/notifications/white-bell';
import NewWhiteBellIcon from 'img/notifications/new-white-bell';
import CrossedBellIcon from 'img/notifications/crossed-bell';
import {
  getActivityAlerts,
  clearActivityAlert,
  clearAllActivityAlerts,
  switchActivityAlerts,
  getActivityAlertsPreferences,
} from 'api/activity-alerts-api';
import { swithAlertsToastsHide } from 'actions/activity-alerts-actions';
import Switch from 'components/common/Switch/Switch';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import { initializePusher } from 'helpers/pusher-instance';

import ActivityAlertsItem from './ActivityAlertsItem/ActivityAlertsItem';
import {
  ActivityAlertsImg,
  ActivityAlertsPopover,
  ActivityAlertsPopoverLabel,
  ActivityAlertsList,
  ActivityAlertsClearAllLabel,
  ActivityAlertsHeader,
  ActivityAlertsSwitchLabel,
  ActivityAlertsHeaderLabel,
  EmptyActivityAlerts,
} from './styled';

const getIconsConfig = variant => {
  switch (variant) {
    case 'white':
      return {
        BellIcon: WhiteBellIcon,
        NewBellIcon: NewWhiteBellIcon,
        MutedBellIcon: CrossedBellIcon,
      };
    case 'blue':
      return {
        BellIcon: BlueBellIcon,
        NewBellIcon: NewBlueBellIcon,
        MutedBellIcon: CrossedBellIcon,
      };
    default:
      return {
        BellIcon: BlueBellIcon,
        NewBellIcon: NewBlueBellIcon,
        MutedBellIcon: CrossedBellIcon,
      };
  }
};

const listenRealTimeAlerts = (
  currentUser,
  setHasUnreadAlertsState,
  enabledAlerts,
  isOpen,
  getActivityAlertsWithLoader,
) => {
  if (!currentUser || !currentUser.userIdentifier || !enabledAlerts) {
    return;
  }

  const currentUserIdentifier = currentUser.userIdentifier;
  const channelName = `private-dock-user-channel-${currentUserIdentifier}`;

  const pusher = initializePusher();
  let channel = pusher.channel(channelName);
  if (!channel || !channel.subscribed) {
    channel = pusher.subscribe(channelName);
  }

  channel.bind('activity-alert', ({ alert }) => {
    if (alert) {
      if (isOpen) {
        getActivityAlertsWithLoader();
      } else {
        sessionStorage.setItem('hasUnreadAlerts', true);
        setHasUnreadAlertsState(true);
      }
    }
  });
};

const ActivityAlerts = ({ variant = 'blue' }) => {
  const { currentUser, alertsEnabledState } = useSelector(store => ({
    currentUser: store.userState.userProfile,
    alertsEnabledState: store.alertsState.alertsEnabled,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [activityAlertsList, setActivityAlertsList] = useState(null);
  const [hasUnreadAlertsState, setHasUnreadAlertsState] = useState(
    JSON.parse(sessionStorage.getItem('hasUnreadAlerts')),
  );
  const [
    activityAlertsListIsFetching,
    setActivityAlertsListIsFetching,
  ] = useState(null);

  const iconReference = useRef(null);
  const dispatch = useDispatch();

  const getActivityAlertsWithLoader = async () => {
    setActivityAlertsListIsFetching(true);
    await getActivityAlerts(setActivityAlertsList);
    setActivityAlertsListIsFetching(false);
  };

  useEffect(() => {
    getActivityAlertsPreferences();
    listenRealTimeAlerts(
      currentUser,
      setHasUnreadAlertsState,
      alertsEnabledState,
      isOpen,
      getActivityAlertsWithLoader,
    );
  }, [currentUser, alertsEnabledState, isOpen]);

  useEffect(() => {
    swithAlertsToastsHide(isOpen)(dispatch);

    if (isOpen) {
      getActivityAlertsWithLoader();
      setHasUnreadAlertsState(false);
    }
  }, [isOpen]);

  const onClearAlert = async activityAlertId => {
    await clearActivityAlert(activityAlertId).then(() => {
      getActivityAlertsWithLoader();
    });
  };

  const onClearAllAlerts = async () => {
    await clearAllActivityAlerts().then(() => {
      getActivityAlertsWithLoader();
    });
  };

  const { BellIcon, NewBellIcon, MutedBellIcon } = getIconsConfig(variant);

  let CurrentBellIcon = BellIcon;

  if (hasUnreadAlertsState && alertsEnabledState) {
    CurrentBellIcon = NewBellIcon;
  } else if (!alertsEnabledState) {
    CurrentBellIcon = MutedBellIcon;
  } else {
    CurrentBellIcon = BellIcon;
  }

  return (
    <>
      <ActivityAlertsImg
        ref={iconReference}
        src={CurrentBellIcon}
        onClick={() => setIsOpen(!isOpen)}
        withAnimaton={hasUnreadAlertsState}
      />
      <ActivityAlertsPopover
        onClick={() => {}}
        open={isOpen}
        anchorEl={iconReference?.current}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <ActivityAlertsHeader>
          <ActivityAlertsHeaderLabel>
            <ActivityAlertsPopoverLabel>
              Notifications
            </ActivityAlertsPopoverLabel>
            <div>
              <Switch
                checked={alertsEnabledState}
                onChange={() => {
                  switchActivityAlerts(!alertsEnabledState);
                }}
              />
              <ActivityAlertsSwitchLabel>
                {alertsEnabledState ? 'ON' : 'OFF'}
              </ActivityAlertsSwitchLabel>
            </div>
          </ActivityAlertsHeaderLabel>
          {activityAlertsList?.length !== 0 && (
            <ActivityAlertsClearAllLabel onClick={onClearAllAlerts}>
              Clear all
            </ActivityAlertsClearAllLabel>
          )}
        </ActivityAlertsHeader>
        <ActivityAlertsList>
          <ViewLoader isFetchingData={activityAlertsListIsFetching}>
            {activityAlertsList?.length === 0 && (
              <EmptyActivityAlerts>
                There are no new notifications at this time
              </EmptyActivityAlerts>
            )}
            {activityAlertsList?.length > 0 &&
              activityAlertsList?.map(itemAlert => (
                <ActivityAlertsItem
                  itemAlert={itemAlert}
                  onClearAlert={() =>
                    onClearAlert(itemAlert?.activityAlertIdentifier)
                  }
                />
              ))}
          </ViewLoader>
        </ActivityAlertsList>
      </ActivityAlertsPopover>
    </>
  );
};

export default ActivityAlerts;
