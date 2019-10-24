import Grid from '@material-ui/core/Grid';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setHeader, unsetHeader } from '../actions/header-actions';
import * as userApi from '../api/user-api';
import CubesLoaderOverlay from '../components/common/CubesLoaderOverlay';
import {
  LogoutHeaderButton,
  ViewContainer,
} from '../components/userProfileView/UserProfileView.Styled';
import LogoutIcon from '../img/drawer/logout';
import UserProfileView from './UserProfileView';
import {
  formFieldDefinitions,
  formSwitchDefinitions,
} from './UserProfileView.FormDefinitions';

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
        title: 'Profile & Settings',
        rightComponents: (
          <Grid container item xs={3} justify="flex-end">
            <LogoutHeaderButton to="logout">
              <LogoutIcon />
              <span>Logout</span>
            </LogoutHeaderButton>
          </Grid>
        ),
      });

      return () => {
        unsetHeader(dispatch)();
      };
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
          {...otherEntries}
        />
      )}
    </ViewContainer>
  );
};

export default UserProfileViewWrapper;
