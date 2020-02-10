import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { setHeader } from '../actions/header-actions';
import { updateOrganizationName } from '../actions/organization-actions';
import * as userApi from '../api/user-api';
import CubesLoaderOverlay from '../components/common/CubesLoaderOverlay';
import {
  LogoutButtonContainer,
  LogoutHeaderButton,
  ViewContainer,
} from '../components/userProfileView/UserProfileView.Styled';
import LogoutIcon from '../img/drawer/logout';
import UserProfileView from './UserProfileView';
import {
  formFieldDefinitions,
  formSwitchDefinitions,
} from './UserProfileView.FormDefinitions';
import validationSchema from './UserProfileView.ValidationSchema';

const Title = styled.div`
  color: #fff;
  font-size: 32px;
  padding-left: 2rem;
`;

const onFormSubmit = (
  { otherSpecialty, otherSubspecialty, otherTitle },
  userProfile,
  dispatch,
) => async data => {
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
        specialtyId: otherSpecialty.specialtyId,
        subSpecialties: [
          {
            subSpecialtyId: otherSubspecialty.subSpecialtyId,
            subSpecialtyName: requestData.subspecialty,
          },
        ],
      },
    ];

    requestData.titles = [
      {
        name: requestData.title,
        titleId: otherTitle.titleId,
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

    toggleAlert('Profile updated successfully!', 'success');

    userApi.getUserById();
    userApi.getUserProfilePic(sessionStorage.userIdentifier, 'PROFILE');
    userApi.getUserNotoficationPrefs();
  } catch (error) {
    toggleAlert('Error updating profile', 'error');
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

const UserProfileViewWrapper = () => {
  const dispatch = useDispatch();

  const {
    userProfile,
    userNotificationPreferences,
    ...otherEntries
  } = useSelector(store => {
    const otherSpecialty = store.userState.allSpecialties?.find(
      ({ name }) => name === 'Other',
    );
    const otherSubspecialty = otherSpecialty?.subSpecialties?.find(
      ({ subSpecialtyName }) => subSpecialtyName === 'Other',
    );
    const otherTitle = store.userState.allTitles?.find(
      ({ name }) => name === 'Other',
    );

    return {
      userProfile: store.userState.userProfile,
      userNotificationPreferences: {
        emailNotificationsEnabled: store.userState.userNotificationPrefs.email,
        pushNotificationsEnabled: store.userState.userNotificationPrefs.push,
      },
      otherSpecialty,
      otherSubspecialty,
      otherTitle,
    };
  });

  useEffect(
    () => {
      userApi.getUserNotoficationPrefs();
      userApi.getAllSpecialties();
      userApi.getAllTitles();

      setHeader(dispatch)({
        backgroundColor: '#007cab',
        layout: [
          {
            key: 'title',
            component: (
              <div>
                <Title>Profile & Settings</Title>
              </div>
            ),
            xs: 6,
            alignItems: 'center',
          },
          {
            key: 'logout',
            component: (
              <LogoutButtonContainer>
                <LogoutHeaderButton to="logout">
                  <LogoutIcon />
                  <span>Logout</span>
                </LogoutHeaderButton>
              </LogoutButtonContainer>
            ),
            alignItems: 'center',
            justify: 'flex-end',
            sm: 6,
            md: 3,
          },
        ],
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { loaderContainerClassName, formContainerClassName } = userProfile
    ? {
        loaderContainerClassName: 'animated fadeOut',
        formContainerClassName: 'animated fadeIn',
      }
    : {
        loaderContainerClassName: '',
        formContainerClassName: 'invisible',
      };

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
      <CubesLoaderOverlay className={loaderContainerClassName} />
      {userProfile && userNotificationPreferences && (
        <UserProfileView
          defaultValues={defaultValues}
          formContainerClassName={formContainerClassName}
          formFieldDefinitions={formFieldDefinitions}
          formSwitchDefinitions={formSwitchDefinitions}
          onSubmit={onFormSubmit({ ...otherEntries }, userProfile, dispatch)}
          validationSchema={validationSchema}
        />
      )}
    </ViewContainer>
  );
};

export default UserProfileViewWrapper;
