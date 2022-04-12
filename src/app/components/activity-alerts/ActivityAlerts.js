/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable sonarjs/no-duplicated-branches */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BlueBellIcon from 'img/notifications/blue-bell';
import NewBlueBellIcon from 'img/notifications/new-blue-bell';
import WhiteBellIcon from 'img/notifications/white-bell';
import NewWhiteBellIcon from 'img/notifications/new-white-bell';
import CrossedBellIcon from 'img/notifications/crossed-bell';
// import SettingsIcon from 'img/settings-icon';
import SettingsIcon from 'img/navigation/SettingsIcon';
import { onActivityAlertOpened } from 'helpers/ga-event-helper';
import * as ActivityAlertsApi from 'api/activity-alerts-api';
import { getNotificationSettings } from 'api/user-api';
import { swithAlertsToastsHide } from 'actions/activity-alerts-actions';
import { clearNotifications } from 'actions/template-actions';
import { initializePusher } from 'helpers/pusher-instance';
import ActivityAlertsItem from './ActivityAlertsItem/ActivityAlertsItem';
import ActivityAlertsSettings from './ActivityAlertsSettings/ActivityAlertsSettings';
import ActivityAlertsLoader from './ActivityAlertsLoader/ActivityAlertsLoader';
import {
  ActivityAlertsImg,
  ActivityAlertsPopover,
  ActivityAlertsPopoverLabel,
  ActivityAlertsList,
  ActivityAlertsClearAllLabel,
  ActivityAlertsHeader,
  ActivityAlertsHeaderLabel,
  EmptyActivityAlerts,
  SettingsButton,
  ActivityAlertsOptions,
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
  getActivityAlerts,
) => {
  if (!currentUser || !currentUser.userIdentifier || !enabledAlerts) {
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
    channel.bind('activity-alert', ({ alert }) => {
      if (alert) {
        if (isOpen) {
          getActivityAlerts();
        } else {
          sessionStorage.setItem('hasUnreadAlerts', true);
          setHasUnreadAlertsState(true);
        }
      }
    });
  }
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const ActivityAlerts = ({ variant = 'blue' }) => {
  const { currentUser, notificationsOpen, notificationsPage } = useSelector(
    store => ({
      currentUser: store.userState.userProfile,
      notificationsOpen: store.templateState.notificationsOpen,
      notificationsPage: store.templateState.notificationsPage,
    }),
  );

  const [isOpen, setIsOpen] = useState(false);
  const [activityAlertsList, setActivityAlertsList] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState('LIST');
  const [hasUnreadAlertsState, setHasUnreadAlertsState] = useState(
    JSON.parse(sessionStorage.getItem('hasUnreadAlerts')),
  );
  const [
    activityAlertsListIsFetching,
    setActivityAlertsListIsFetching,
  ] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState([]);

  const iconReference = useRef(null);
  const dispatch = useDispatch();

  const getActivityAlerts = async () => {
    const alerts = await ActivityAlertsApi.getActivityAlerts();
    setActivityAlertsList(alerts);
  };

  useEffect(() => {
    if (notificationsOpen && !isOpen) {
      setIsOpen(true);
      if (notificationsPage !== '') {
        setSelectedScreen(notificationsPage);
      }
      dispatch(clearNotifications());
    }
  }, [notificationsOpen, notificationsPage]);

  useEffect(() => {
    ActivityAlertsApi.getActivityAlertsPreferences();
    listenRealTimeAlerts(
      currentUser,
      setHasUnreadAlertsState,
      isOpen,
      getActivityAlerts,
    );
  }, [currentUser, isOpen]);

  useEffect(() => {
    swithAlertsToastsHide(isOpen)(dispatch);

    if (isOpen) {
      (async () => {
        setActivityAlertsListIsFetching(true);
        await getActivityAlerts();
        setActivityAlertsListIsFetching(false);
        setHasUnreadAlertsState(false);
      })();
    }

    if (!isOpen) {
      setSelectedScreen('LIST');
    }
  }, [isOpen]);

  const refreshNotificationSettings = useCallback(() => {
    (async function fetchData() {
      const {
        notificationSettings: notificationSettingsData,
      } = await getNotificationSettings();
      setNotificationSettings(notificationSettingsData);
    })();
  }, []);

  useEffect(() => {
    refreshNotificationSettings();
  }, [refreshNotificationSettings]);

  const onClearAlert = async activityAlertId => {
    setActivityAlertsList(previousList =>
      previousList?.filter(
        ({ activityAlertIdentifier }) =>
          activityAlertIdentifier !== activityAlertId,
      ),
    );
    try {
      await ActivityAlertsApi.clearActivityAlert(activityAlertId);
    } catch {
      getActivityAlerts();
    }
  };

  const onClearAllAlerts = async () => {
    await ActivityAlertsApi.clearAllActivityAlerts();
    getActivityAlerts();
  };

  const hasAnyOptionTurnedOn = notificationSettings.some(
    ({ emailEnabled, pushNotificationEnabled }) =>
      emailEnabled || pushNotificationEnabled,
  );

  const { BellIcon, NewBellIcon, MutedBellIcon } = getIconsConfig(variant);

  let CurrentBellIcon = BellIcon;

  if (hasUnreadAlertsState && hasAnyOptionTurnedOn) {
    CurrentBellIcon = NewBellIcon;
  } else if (!hasAnyOptionTurnedOn) {
    CurrentBellIcon = MutedBellIcon;
  } else {
    CurrentBellIcon = BellIcon;
  }

  return (
    <>
      <ActivityAlertsImg
        ref={iconReference}
        src={CurrentBellIcon}
        onClick={() => {
          onActivityAlertOpened();
          setIsOpen(!isOpen);
        }}
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
        {selectedScreen === 'LIST' && (
          <>
            <ActivityAlertsHeader>
              <ActivityAlertsHeaderLabel>
                <ActivityAlertsPopoverLabel>
                  Notifications
                </ActivityAlertsPopoverLabel>
              </ActivityAlertsHeaderLabel>
              <ActivityAlertsOptions>
                {activityAlertsList?.length !== 0 && (
                  <ActivityAlertsClearAllLabel onClick={onClearAllAlerts}>
                    Clear all
                  </ActivityAlertsClearAllLabel>
                )}
                <SettingsButton onClick={() => setSelectedScreen('SETTINGS')}>
                  <SettingsIcon strokeColor="#8492A4" fillColor="none" />
                </SettingsButton>
              </ActivityAlertsOptions>
            </ActivityAlertsHeader>
            <ActivityAlertsList>
              {!activityAlertsListIsFetching ? (
                <>
                  {activityAlertsList?.length === 0 && (
                    <EmptyActivityAlerts>
                      There are no new notifications at this time
                    </EmptyActivityAlerts>
                  )}
                  {activityAlertsList?.length > 0 &&
                    activityAlertsList?.map(itemAlert => (
                      <ActivityAlertsItem
                        key={itemAlert.activityAlertIdentifier}
                        itemAlert={itemAlert}
                        onClearAlert={() =>
                          onClearAlert(itemAlert?.activityAlertIdentifier)
                        }
                        closeAlerts={() => {
                          setIsOpen(false);
                        }}
                      />
                    ))}
                </>
              ) : (
                <ActivityAlertsLoader />
              )}
            </ActivityAlertsList>
          </>
        )}
        {selectedScreen === 'SETTINGS' && (
          <ActivityAlertsSettings
            setSelectedScreen={setSelectedScreen}
            hasAnyOptionTurnedOn={hasAnyOptionTurnedOn}
            notificationSettings={notificationSettings}
            refreshNotificationSettings={refreshNotificationSettings}
          />
        )}
      </ActivityAlertsPopover>
    </>
  );
};

export default ActivityAlerts;
