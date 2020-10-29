import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import ArrowLeftIcon from 'img/arrow-left.svg';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from 'api/user-api';
import {
  ActivityAlertsPopoverLabel,
  ActivityAlertsHeader,
  ActivityAlertsHeaderLabel,
} from '../styled';
import {
  ActivityAlertsSettingsContainer,
  ActivityAlertsSettingsItem,
  ActivityAlertsSettingsItemsContainer,
  ActivityAlertsSettingsItemsHeader,
  ActivityAlertsSettingsItemsHeaderLabel,
  ActivityAlertsSettingsItemsHeaderBlueLabel,
  BlueCheckbox,
  CheckboxContainer,
  ArrowButton,
} from './styled';

const ActivityAlertsSettingsRow = ({
  setting,
  refreshNotificationSettings,
}) => {
  const { label, description, pushNotificationEnabled, emailEnabled } = setting;
  return (
    <ActivityAlertsSettingsItem>
      <Grid container>
        <Grid item xs={6}>
          <div>{label}</div>
          <span>{description}</span>
        </Grid>
        <Grid item xs={3}>
          <CheckboxContainer>
            <BlueCheckbox
              checked={pushNotificationEnabled}
              color="secondary"
              onChange={() =>
                updateNotificationSettings([
                  {
                    ...setting,
                    pushNotificationEnabled: !pushNotificationEnabled,
                  },
                ]).then(refreshNotificationSettings)
              }
            />
          </CheckboxContainer>
        </Grid>
        <Grid item xs={3}>
          <CheckboxContainer>
            <BlueCheckbox
              checked={emailEnabled}
              onChange={() =>
                updateNotificationSettings([
                  {
                    ...setting,
                    emailEnabled: !emailEnabled,
                  },
                ]).then(refreshNotificationSettings)
              }
            />
          </CheckboxContainer>
        </Grid>
      </Grid>
    </ActivityAlertsSettingsItem>
  );
};

const ActivityAlertsSettings = ({ setSelectedScreen }) => {
  const [notificationSettings, setNotificationSettings] = useState([]);

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

  return (
    <ActivityAlertsSettingsContainer>
      <ActivityAlertsHeader>
        <ActivityAlertsHeaderLabel>
          <ActivityAlertsPopoverLabel>
            <ArrowButton onClick={() => setSelectedScreen('LIST')}>
              <img src={ArrowLeftIcon} alt="back-navigation" />
            </ArrowButton>
            Settings
          </ActivityAlertsPopoverLabel>
        </ActivityAlertsHeaderLabel>
      </ActivityAlertsHeader>
      <ActivityAlertsSettingsItemsContainer>
        <ActivityAlertsSettingsItemsHeader>
          <Grid container>
            <Grid item xs={6} alignItems="flex-start" justify="flex-start">
              <ActivityAlertsSettingsItemsHeaderBlueLabel>
                NOTIFY ME WHEN
              </ActivityAlertsSettingsItemsHeaderBlueLabel>
            </Grid>
            <Grid item xs={3}>
              <ActivityAlertsSettingsItemsHeaderLabel>
                NOTIFICATIONS
              </ActivityAlertsSettingsItemsHeaderLabel>
            </Grid>
            <Grid item xs={3}>
              <ActivityAlertsSettingsItemsHeaderLabel>
                EMAILS
              </ActivityAlertsSettingsItemsHeaderLabel>
            </Grid>
          </Grid>
        </ActivityAlertsSettingsItemsHeader>
        {notificationSettings?.map(setting => (
          <ActivityAlertsSettingsRow
            setting={setting}
            refreshNotificationSettings={refreshNotificationSettings}
          />
        ))}
      </ActivityAlertsSettingsItemsContainer>
    </ActivityAlertsSettingsContainer>
  );
};

export default ActivityAlertsSettings;
