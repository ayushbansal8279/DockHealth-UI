import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { setHeader } from 'actions/header-actions';
import { updateOrganizationName } from 'actions/organization-actions';
import * as userApi from 'api/user-api';
import GenericHeader from 'components/common/GenericHeader';
import { ViewContainer } from 'components/userProfileView/UserProfileView.Styled';
import UserProfileView from './UserProfileView';
import {
  formFieldDefinitions,
  formSwitchDefinitions,
} from './UserProfileView.FormDefinitions';
import validationSchema from './UserProfileView.ValidationSchema';

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

    toggleAlert('Profile updated successfully!', 'success');

    userApi.getUserById();
    userApi.getUserProfilePic(sessionStorage.userIdentifier, 'PROFILE');
    userApi.getUserNotoficationPrefs();
  } catch (error) {
    console.log(error);
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
      {userProfile && userNotificationPreferences && (
        <UserProfileView
          defaultValues={defaultValues}
          formFieldDefinitions={formFieldDefinitions}
          formSwitchDefinitions={formSwitchDefinitions}
          onSubmit={onFormSubmit({ userProfile, dispatch })}
          validationSchema={validationSchema}
        />
      )}
    </ViewContainer>
  );
};

export default UserProfileViewWrapper;
