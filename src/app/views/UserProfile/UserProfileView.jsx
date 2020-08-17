import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import palette from 'styles/palette';
import { isEmpty } from 'ramda';
import { setHeader } from 'actions/header-actions';
import { updateOrganizationName } from 'actions/organization-actions';
import * as userApi from 'api/user-api';
import GenericHeader from 'components/common/GenericHeader';
import Spacing from 'components/common/Spacing';
import { ViewContainer } from 'components/userProfileView/UserProfileView.Styled';
import * as AlertActions from 'alert/actions';
import UserProfileForm from './UserProfileForm';
import {
  formFieldDefinitions,
  formSwitchDefinitions,
} from './UserProfileView.FormDefinitions';
import validationSchema from './UserProfileView.ValidationSchema';
import {
  ProfileSettingsWrapper,
  ViewHeader,
  ViewDescription,
  Divider,
  SectionHeader,
  OrganizationDetails,
  DetailsText,
  ActionButton,
} from './styled';
import OrganizationAvatar from '../../components/common/OrganizationAvatar/OrganizationAvatar';

const onFormSubmit = ({ userProfile, dispatch }) => async data => {
  const {
    emailNotificationsEnabled,
    pushNotificationsEnabled,
    ...otherData
  } = data;

  try {
    const requestData = {};
    formFieldDefinitions
      .filter(({ readOnly = false }) => !readOnly)
      .forEach(({ key, isPhoneNumber }) => {
        const value = otherData[key];

        requestData[key] = isPhoneNumber ? value?.replace(/-/g, '') : value;
      });

    requestData.specialties = [
      {
        name: requestData.specialty,
        // specialtyId: otherSpecialty.specialtyId,
        // subSpecialties: [
        //   {
        //     subSpecialtyId: otherSubspecialty.subSpecialtyId,
        //     subSpecialtyName: requestData.subspecialty,
        //   },
        // ],
      },
    ];

    requestData.titles = [
      {
        name: requestData.title,
        // titleId: otherTitle.titleId,
      },
    ];

    await userApi.updateUser(requestData);

    if (
      requestData.organizationName &&
      requestData.organizationName !== userProfile.organizationName
    ) {
      const { organizationName } = requestData;
      updateOrganizationName({ organizationName })(dispatch);
    }

    await userApi.updateUserNotoficationPrefs(
      emailNotificationsEnabled,
      pushNotificationsEnabled,
    );

    dispatch(
      AlertActions.showGlobalAlert('Profile updated successfully!', 'success'),
    );

    userApi.getUserById();
    userApi.getUserProfilePic(sessionStorage.userIdentifier, 'PROFILE');
    userApi.getUserNotoficationPrefs();
  } catch (error) {
    console.log(error);
    dispatch(AlertActions.showGlobalAlert('Error updating profile', 'error'));
  }
};

const checkOrganizationNameForEditable = (
  allFormFieldDefinitions,
  userProfile,
) => {
  allFormFieldDefinitions
    .filter(({ readOnly = true }) => readOnly)
    .forEach(fieldDef => {
      const fieldDefToUpdate = fieldDef;
      if (
        fieldDefToUpdate.key === 'organizationName' &&
        (userProfile.orgUserRole === 'ADMIN' ||
          userProfile.orgUserRole === 'OWNER') &&
        fieldDefToUpdate !== undefined
      ) {
        fieldDefToUpdate.readOnly = false;
      }
    });
};

const UserProfileView = () => {
  const dispatch = useDispatch();
  const canLeaveCurrentOrganization = false;

  const { userProfile, userNotificationPreferences } = useSelector(store => {
    return {
      userProfile: store.userState.userProfile,
      userNotificationPreferences: {
        emailNotificationsEnabled: store.userState.userNotificationPrefs.email,
        pushNotificationsEnabled: store.userState.userNotificationPrefs.push,
      },
    };
  });

  useMount(() => {
    userApi.getUserNotoficationPrefs();
  });

  useEffect(
    () => {
      userApi.getUserNotoficationPrefs();
      // userApi.getAllSpecialties();
      // userApi.getAllTitles();

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

  checkOrganizationNameForEditable(formFieldDefinitions, userProfile);

  const defaultValues = Object.fromEntries(
    [...formFieldDefinitions, ...formSwitchDefinitions].map(
      ({
        key,
        isPhoneNumber = false,
        defaultValue = '',
        defaultValueGetter = () => undefined,
      }) => {
        let newDefaultValue =
          defaultValueGetter(userProfile) ||
          (userNotificationPreferences || {})[key] ||
          (userProfile || {})[key] ||
          defaultValue;

        if (isPhoneNumber) {
          newDefaultValue = newDefaultValue.replace(
            /(\d{3})(\d{3})(\d{4})/,
            '$1-$2-$3',
          );
        }

        return [key, newDefaultValue];
      },
    ),
  );

  return (
    <ViewContainer>
      {!isEmpty(userProfile) && userNotificationPreferences && (
        <ProfileSettingsWrapper>
          <ViewHeader>Manage Your Profile</ViewHeader>
          <ViewDescription>
            This is where you can make changes to your profile information. View
            our <a href="/">Privacy Policy</a>.
          </ViewDescription>
          <Spacing vertical={4} />
          <Divider />
          <Spacing vertical={5} />
          <section>
            <SectionHeader>My Organization</SectionHeader>
            <Spacing vertical={5} />
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <OrganizationAvatar
                initials="bgi"
                backgroundColor={palette.orange}
              />
              <Spacing horizontal={4} />
              <OrganizationDetails>
                <DetailsText>Boston Children&apos;s Hospital</DetailsText>
                <DetailsText>Guest</DetailsText>
              </OrganizationDetails>
              <Spacing horizontal={5} />
              {canLeaveCurrentOrganization && (
                <ActionButton type="button" onClick={() => {}}>
                  Leave organization
                </ActionButton>
              )}
            </Grid>
          </section>
          <Spacing vertical={5} />
          <Divider />
          <Spacing vertical={5} />
          <section>
            <SectionHeader>My profile</SectionHeader>
            <Spacing vertical={5} />
            <UserProfileForm
              defaultValues={defaultValues}
              formFieldDefinitions={formFieldDefinitions}
              formSwitchDefinitions={formSwitchDefinitions}
              onSubmit={onFormSubmit({ userProfile, dispatch })}
              validationSchema={validationSchema}
            />
          </section>
        </ProfileSettingsWrapper>
      )}
    </ViewContainer>
  );
};

export default UserProfileView;
