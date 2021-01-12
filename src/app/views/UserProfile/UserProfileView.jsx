import React, { useEffect, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { isEmpty } from 'ramda';
import MobileDevices from 'img/devices';
import { setHeader } from 'actions/header-actions';
import * as userApi from 'api/user-api';
import OrganizationAvatar from 'components/Organization/OrganizationAvatar/OrganizationAvatar';
import {
  openModal as openModalAction,
  closeModal as closeModalAction,
} from 'modal/actions';
import { showGlobalAlert as showGlobalAlertAction } from 'alert/actions';
import AlertTypes from 'alert/AlertTypes';
import GenericHeader from 'components/common/GenericHeader';
import Spacing from 'components/common/Spacing';
import { getOrgRole } from 'helpers/people-helper';
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
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const { params = {} } = useRouteMatch();
  const { section } = params;

  const { userProfile } = useSelector(store => {
    return {
      userProfile: store.userState.userProfile,
    };
  });

  useEffect(
    () => {
      userApi.getUserNotificationPrefs();

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

  const handleLeaveOrganiztion = useCallback(() => {
    dispatch(
      openModalAction('LeaveOrganization', {
        confirm: () => {
          userApi
            .leaveOrganization(userProfile.organizationIdentifier)
            .then(() => {
              userApi.logout(history);
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

  useEffect(() => {
    if (section === 'leave-organization') {
      handleLeaveOrganiztion();
    } else if (
      section === 'edit-organization' &&
      ['ADMIN', 'OWNER'].includes(userProfile?.orgUserRole)
    ) {
      dispatch(
        openModalAction('EditOrganization', {
          userProfile,
          onSuccess: userApi.getUserById,
        }),
      );
    }
  }, [dispatch, handleLeaveOrganiztion, section, userProfile, userOrgRole]);

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
                  onSuccess: userApi.getUserById,
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

  return (
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
                initials={userProfile.organizationInitials}
                backgroundColor={userProfile.organizationProfileColor}
              />
              <Spacing horizontal={4} />
              <OrganizationDetails>
                <DetailsText>{userProfile.organizationName}</DetailsText>
                <DetailsText>{userOrgRole}</DetailsText>
              </OrganizationDetails>
              <Spacing horizontal={5} />
              {renderOrganizationActionButton()}
            </Grid>
          </SettingsSection>
          <Divider />
          <UserProfileForm userProfile={userProfile} />
          <Spacing vertical={8} />
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
