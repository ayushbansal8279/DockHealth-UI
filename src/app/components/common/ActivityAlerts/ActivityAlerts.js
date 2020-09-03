/* eslint-disable sonarjs/no-duplicated-branches */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import Switch from 'components/common/Switch/Switch';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import pusherInstance from 'helpers/pusher-instance';

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
) => {
  if (!currentUser || !currentUser.userIdentifier || !enabledAlerts) {
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
      setHasUnreadAlertsState(true);
    }
  });
};

const ActivityAlerts = ({ variant = 'blue' }) => {
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
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

  const [enabledAlerts, setEnabledAlerts] = useState(
    JSON.parse(sessionStorage.getItem('notificationsEnabled')),
  );
  const iconReference = useRef(null);

  const getActivityAlertsWithLoader = async () => {
    setActivityAlertsListIsFetching(true);
    await getActivityAlerts(setActivityAlertsList);
    setActivityAlertsListIsFetching(false);
  };

  useEffect(() => {
    getActivityAlertsPreferences();
    listenRealTimeAlerts(currentUser, setHasUnreadAlertsState, enabledAlerts);
  }, [currentUser, enabledAlerts]);

  useEffect(() => {
    if (isOpen) {
      getActivityAlertsWithLoader();
      setHasUnreadAlertsState(false);
    }
  }, [isOpen]);

  useEffect(() => {
    switchActivityAlerts(enabledAlerts);
  }, [enabledAlerts]);

  const onClearAlert = async activityAlertId => {
    await clearActivityAlert(activityAlertId, getActivityAlertsWithLoader);
  };

  const onClearAllAlerts = async () => {
    await clearAllActivityAlerts(getActivityAlertsWithLoader);
  };

  const { BellIcon, NewBellIcon, MutedBellIcon } = getIconsConfig(variant);

  let CurrentBellIcon = BellIcon;

  if (hasUnreadAlertsState && enabledAlerts) {
    CurrentBellIcon = NewBellIcon;
  } else if (!enabledAlerts) {
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
                checked={enabledAlerts}
                onChange={() => setEnabledAlerts(!enabledAlerts)}
              />
              <ActivityAlertsSwitchLabel>
                {enabledAlerts ? 'ON' : 'OFF'}
              </ActivityAlertsSwitchLabel>
            </div>
          </ActivityAlertsHeaderLabel>
          <ActivityAlertsClearAllLabel onClick={onClearAllAlerts}>
            Clear all
          </ActivityAlertsClearAllLabel>
        </ActivityAlertsHeader>
        <ActivityAlertsList>
          <ViewLoader isFetchingData={activityAlertsListIsFetching}>
            {activityAlertsList?.length === 0 && (
              <EmptyActivityAlerts>
                There are no new notificaitons at this time
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
