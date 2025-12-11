import React from 'react';
import { Grid } from '@mui/material';
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
  AllEventsItem,
} from './styled';

const ActivityAlertsSettingsRow = ({
  setting,
  refreshNotificationSettings,
  pushDisabled = false,
  emailDisabled = false,
  ItemComponent = ActivityAlertsSettingsItem,
  isEnabled,
}) => {
  const { label, description, pushNotificationEnabled, emailEnabled } = setting;
  return (
    <ItemComponent $isEnabled={isEnabled}>
      <Grid container>
        <Grid item size={6}>
          <div>{label}</div>
          <span>{description}</span>
        </Grid>
        <Grid item size={3}>
          <CheckboxContainer $disabled={pushDisabled}>
            <BlueCheckbox
              checked={pushNotificationEnabled}
              disabled={pushDisabled}
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
        <Grid item size={3}>
          <CheckboxContainer $disabled={emailDisabled}>
            <BlueCheckbox
              checked={emailEnabled}
              disabled={emailDisabled}
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
    </ItemComponent>
  );
};

const ActivityAlertsSettings = ({
  setSelectedScreen,
  notificationSettings,
  refreshNotificationSettings,
}) => {
  const allEventsSetting = notificationSettings?.find(
    (setting) => setting.eventType === 'ALL_EVENTS',
  );
  const otherSettings = notificationSettings?.filter(
    (setting) => setting.eventType !== 'ALL_EVENTS',
  );

  const isAllEventsPushEnabled =
    allEventsSetting?.pushNotificationEnabled ?? true;
  const isAllEventsEmailEnabled = allEventsSetting?.emailEnabled ?? true;
  const isAllEventsEnabled = isAllEventsPushEnabled && isAllEventsEmailEnabled;

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
            <Grid
              item
              size={6}
              alignItems="flex-start"
              justifyContent="flex-start"
            />
            <Grid item size={3}>
              <ActivityAlertsSettingsItemsHeaderLabel
                $disabled={!isAllEventsPushEnabled}
              >
                IN APP
              </ActivityAlertsSettingsItemsHeaderLabel>
            </Grid>
            <Grid item size={3}>
              <ActivityAlertsSettingsItemsHeaderLabel
                $disabled={!isAllEventsEmailEnabled}
              >
                EMAILS
              </ActivityAlertsSettingsItemsHeaderLabel>
            </Grid>
          </Grid>
        </ActivityAlertsSettingsItemsHeader>

        {allEventsSetting && (
          <ActivityAlertsSettingsRow
            key={allEventsSetting.eventType}
            setting={allEventsSetting}
            refreshNotificationSettings={refreshNotificationSettings}
            ItemComponent={AllEventsItem}
            isEnabled={isAllEventsEnabled}
          />
        )}

        {otherSettings?.map((setting) => (
          <ActivityAlertsSettingsRow
            key={setting.eventType}
            setting={setting}
            refreshNotificationSettings={refreshNotificationSettings}
            pushDisabled={!isAllEventsPushEnabled}
            emailDisabled={!isAllEventsEmailEnabled}
          />
        ))}
      </ActivityAlertsSettingsItemsContainer>
    </ActivityAlertsSettingsContainer>
  );
};

export default ActivityAlertsSettings;
