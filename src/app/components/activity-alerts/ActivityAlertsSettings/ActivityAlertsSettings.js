import React from 'react';
import { Grid } from '@material-ui/core';
import ArrowLeftIcon from 'img/arrow-left.svg';
import { updateNotificationSettings } from 'api/user-api';
import {
  ActivityAlertsPopoverLabel,
  ActivityAlertsHeaderLabel,
} from '../styled';
import {
  ActivityAlertsSettingsHeader,
  ActivityAlertsSettingsContainer,
  ActivityAlertsSettingsItem,
  ActivityAlertsSettingsItemsContainer,
  ActivityAlertsSettingsItemsHeader,
  ActivityAlertsSettingsItemsHeaderLabel,
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

const ActivityAlertsSettings = ({
  setSelectedScreen,
  notificationSettings,
  refreshNotificationSettings,
}) => {
  return (
    <ActivityAlertsSettingsContainer>
      <ActivityAlertsSettingsHeader>
        <ActivityAlertsHeaderLabel>
          <ActivityAlertsPopoverLabel>
            {typeof setSelectedScreen === 'function' && (
              <ArrowButton onClick={() => setSelectedScreen('LIST')}>
                <img src={ArrowLeftIcon} alt="back-navigation" />
              </ArrowButton>
            )}
            Task notification preferences
          </ActivityAlertsPopoverLabel>
        </ActivityAlertsHeaderLabel>
      </ActivityAlertsSettingsHeader>
      <ActivityAlertsSettingsItemsContainer>
        <ActivityAlertsSettingsItemsHeader>
          <Grid container>
            <Grid item xs={6} alignItems="flex-start" justify="flex-start" />
            <Grid item xs={3}>
              <ActivityAlertsSettingsItemsHeaderLabel>
                IN APP
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
