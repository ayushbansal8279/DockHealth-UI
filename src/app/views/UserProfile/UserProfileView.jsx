import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'ramda';
import MobileDevices from 'img/devices';
import { setHeader } from 'actions/header-actions';
import * as userApi from 'api/user-api';
import GenericHeader from 'components/common/GenericHeader';
import Spacing from 'components/common/Spacing';
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
import OrganizationAvatar from '../../components/common/OrganizationAvatar/OrganizationAvatar';

const UserProfileView = () => {
  const dispatch = useDispatch();

  const { userProfile, userNotificationPreferences } = useSelector(store => {
    return {
      userProfile: store.userState.userProfile,
      userNotificationPreferences: {
        emailNotificationsEnabled: store.userState.userNotificationPrefs?.email,
        pushNotificationsEnabled: store.userState.userNotificationPrefs?.push,
      },
    };
  });

  const canLeaveCurrentOrganization = userProfile.orgUserRole === 'GUEST'; // TODO: test after API update

  useEffect(
    () => {
      userApi.getUserNotoficationPrefs();

      setHeader(dispatch)({
        layout: [
          {
            key: 'title',
            component: <GenericHeader>Profile & Settings</GenericHeader>,
          },
        ],
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const getOrgRole = () => {
    switch (userProfile.orgUserRole) {
      case 'OWNER':
        return 'Owner';
      case 'ADMIN':
        return 'Admin';
      case 'MEMBER':
        return 'Member';
      case 'GUEST':
        return 'Guest';
      default:
        return '';
    }
  };

  return (
    <ViewContainer>
      {!isEmpty(userProfile) && userNotificationPreferences && (
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
                initials={userProfile.organizationInitials}
                backgroundColor={userProfile.organizationProfileColor}
              />
              <Spacing horizontal={4} />
              <OrganizationDetails>
                <DetailsText>{userProfile.organizationName}</DetailsText>
                <DetailsText>{getOrgRole()}</DetailsText>
              </OrganizationDetails>
              <Spacing horizontal={5} />
              {canLeaveCurrentOrganization && (
                <ActionButton type="button" onClick={() => {}}>
                  Leave organization
                </ActionButton>
              )}
            </Grid>
          </SettingsSection>
          <Divider />
          <UserProfileForm
            userProfile={userProfile}
            userNotificationPreferences={userNotificationPreferences}
          />
          <Spacing vertical={5} />
          <Divider />
          <Spacing vertical={2} />
          <AppVersionInfoWrapper>
            <AppVersionInfoIcon src={MobileDevices} alt="Mobile app" />
            <AppVersionInfoTextWrapper>
              <AppVersionInfoHeader>
                Desktop and Mobile versions
              </AppVersionInfoHeader>
              <AppVersionInfoText>
                Dock is there where you need us. Access through your desktop or
                take the{' '}
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
  );
};

export default UserProfileView;
