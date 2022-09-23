import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import isEmpty from 'ramda/src/isEmpty';
import MobileDevices from 'img/devices';
import * as UserAuthApi from 'api/user-auth-api';
import * as OrganizationApi from 'api/organization-api';
import OrganizationAvatar from 'components/org/OrganizationAvatar/OrganizationAvatar';
import {
  openModal as openModalAction,
  closeModal as closeModalAction,
} from 'modal/actions';
import { showGlobalAlert as showGlobalAlertAction } from 'alert/actions';
import AlertTypes from 'alert/AlertTypes';
import {
  getCurrentUserOrganizations,
  getCurrentUserNotificationPreferences,
} from 'actions/user-actions';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import Spacing from 'components/common/Spacing';
import { getOrgRole } from 'helpers/user-helper';
import {
  userProfileSelector,
  userOrganizationsSelector,
} from 'selectors/user-selectors';
import ActivityAlertsSettings from 'components/activity-alerts/ActivityAlertsSettings/ActivityAlertsSettings';
import { getNotificationSettings } from 'api/user-api';
import UserProfileForm from './UserProfileForm/UserProfileForm';
import {
  ProfileSettingsWrapper,
  ViewHeader,
  ViewDescription,
  Divider,
  SectionHeader,
  OrganizationDetails,
  DetailsText,
  ActionButton,
  SettingsSection,
  ViewContainer,
  AppVersionInfoWrapper,
  AppVersionInfoIcon,
  AppVersionInfoTextWrapper,
  AppVersionInfoText,
  AppVersionInfoHeader,
} from './styled';

const UserProfileView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [notificationSettings, setNotificationSettings] = useState([]);

  const userProfile = useSelector(userProfileSelector);
  const userOrganizations = useSelector(userOrganizationsSelector);

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

  const currentOrganization = useMemo(
    () =>
      userOrganizations?.find(
        ({ organizationIdentifier }) =>
          organizationIdentifier === userProfile.organizationIdentifier,
      ),
    [userOrganizations, userProfile],
  );

  useEffect(
    () => {
      dispatch(getCurrentUserNotificationPreferences());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleLeaveOrganiztion = useCallback(() => {
    dispatch(
      openModalAction('LeaveOrganization', {
        confirm: () => {
          OrganizationApi.leaveOrganization(userProfile.organizationIdentifier)
            .then(() => {
              UserAuthApi.logout(history);
            })
            .catch(() => {
              dispatch(closeModalAction());
              dispatch(
                showGlobalAlertAction(
                  'Something went wrong!',
                  AlertTypes.ERROR,
                ),
              );
            });
        },
      }),
    );
  }, [dispatch, history, userProfile.organizationIdentifier]);

  const userOrgRole = getOrgRole(userProfile?.orgUserRole);

  const renderOrganizationActionButton = () => {
    switch (userProfile.orgUserRole) {
      case 'GUEST':
        return (
          <ActionButton type="button" onClick={handleLeaveOrganiztion}>
            Leave organization
          </ActionButton>
        );

      case 'OWNER':
      case 'ADMIN':
        return (
          <ActionButton
            type="button"
            onClick={() =>
              dispatch(
                openModalAction('EditOrganization', {
                  userProfile,
                  onSuccess: () => dispatch(getCurrentUserOrganizations()),
                }),
              )
            }
          >
            Edit organization
          </ActionButton>
        );

      default:
        return null;
    }
  };

  const hasAnyOptionTurnedOn = notificationSettings.some(
    ({ emailEnabled, pushNotificationEnabled }) =>
      emailEnabled || pushNotificationEnabled,
  );

  return (
    <ViewLayout header={<BasicLayoutHeader title="Profile &amp; Settings" />}>
      <ViewContainer>
        {!isEmpty(userProfile) && (
          <ProfileSettingsWrapper>
            <SettingsSection noMarginTop>
              <ViewHeader>Manage Your Profile</ViewHeader>
              <ViewDescription>
                This is where you can make changes to your profile information.
                View our{' '}
                <a
                  href="https://www.dock.health/privacy-statement"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Statement
                </a>
                .
              </ViewDescription>
            </SettingsSection>
            <Divider />
            <SettingsSection>
              <SectionHeader>My Organization</SectionHeader>
              <Spacing vertical={5} />
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
              >
                <OrganizationAvatar
                  initials={currentOrganization.organizationInitials}
                  backgroundColor={currentOrganization.organizationProfileColor}
                />
                <Spacing horizontal={4} />
                <OrganizationDetails>
                  <DetailsText>
                    {currentOrganization.organizationName}
                  </DetailsText>
                  <DetailsText>{userOrgRole}</DetailsText>
                </OrganizationDetails>
                <Spacing horizontal={5} />
                {renderOrganizationActionButton()}
              </Grid>
            </SettingsSection>
            <Divider />
            <UserProfileForm userProfile={userProfile} />
            <Spacing vertical={6} />
            <Box position="relative" left="-24px">
              <ActivityAlertsSettings
                hasAnyOptionTurnedOn={hasAnyOptionTurnedOn}
                notificationSettings={notificationSettings}
                refreshNotificationSettings={refreshNotificationSettings}
              />
            </Box>
            <Spacing vertical={6} />
            <Divider />
            <AppVersionInfoWrapper>
              <AppVersionInfoIcon src={MobileDevices} alt="Mobile app" />
              <AppVersionInfoTextWrapper>
                <AppVersionInfoHeader>
                  Desktop and Mobile versions
                </AppVersionInfoHeader>
                <AppVersionInfoText>
                  Dock is there where you need us. Access through your desktop
                  or take the{' '}
                  <a
                    href="https://apps.apple.com/us/app/dock-health/id1277060287"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mobile app
                  </a>{' '}
                  on your rounds.
                </AppVersionInfoText>
              </AppVersionInfoTextWrapper>
            </AppVersionInfoWrapper>
          </ProfileSettingsWrapper>
        )}
      </ViewContainer>
    </ViewLayout>
  );
};

export default UserProfileView;
