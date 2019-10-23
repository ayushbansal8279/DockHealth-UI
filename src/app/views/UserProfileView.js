import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React, { useEffect } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import * as userApi from '../api/user-api';
import CubesLoader from '../components/common/CubesLoader';
import CubesLoaderOverlay from '../components/common/CubesLoaderOverlay';
import StyledInput from '../components/userProfileView/StyledInput';
import StyledSwitch from '../components/userProfileView/StyledSwitch';
import UserAvatar from '../components/userProfileView/UserAvatar';
import LogoutIcon from '../img/drawer/logout';

import {
  FormContainer,
  FormSwitchListItem,
  SectionSubtypography,
  SectionTypography,
  SubmitButton,
  UserAvatarGrid,
  UserAvatarSupplement,
  ViewContainer,
  PlainLink,
  LogoutHeaderButton,
} from '../components/userProfileView/UserProfileView.Styled';
import { noop } from '../helpers/utilityFunctions';
import {
  formFieldDefinitions,
  formSwitchDefinitions,
} from './UserProfileView.FormDefinitions';
import validationSchema from './UserProfileView.ValidationSchema';
import { setHeader, unsetHeader } from '../actions/header-actions';

const renderFormFieldDefinition = ({
  key,
  label,
  required = false,
  readOnly = false,
  type = 'text',
}) => (
  <Grid key={key} item xs={12}>
    <StyledInput
      type={type}
      name={key}
      label={label}
      required={required}
      readOnly={readOnly}
    />
  </Grid>
);

const renderFormSwitchDefinition = ({ key, label, sublabels }) => (
  <FormSwitchListItem key={key}>
    <Grid container alignItems="flex-start" justify="space-between">
      <div>
        <SectionTypography>{label}</SectionTypography>
        {sublabels.map(sublabel => (
          <SectionSubtypography key={sublabel}>{sublabel}</SectionSubtypography>
        ))}
      </div>
      <StyledSwitch name={key} />
    </Grid>
  </FormSwitchListItem>
);

const onSubmit = async data => {
  const {
    emailNotificationsEnabled,
    pushNotificationsEnabled,
    ...otherData
  } = data;

  try {
    await userApi.updateUser(otherData);

    await userApi.updateUserNotoficationPrefs(
      emailNotificationsEnabled,
      pushNotificationsEnabled,
    );

    toggleAlert('Profile updated successfully!', 'success');

    userApi.getUserById();
    userApi.getUserProfilePic(sessionStorage.userId, 'PROFILE');
    userApi.getUserNotoficationPrefs();
  } catch {
    toggleAlert('Error updating profile', 'error');
  }
};

const UserProfileView = ({ defaultValues, formContainerClassName }) => {
  const formMethods = useForm({
    defaultValues,
    validationSchema,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  return (
    <FormContext {...formMethods}>
      <FormContainer
        className={formContainerClassName}
        onSubmit={handleSubmit(isSubmitting ? noop : onSubmit)}
      >
        <Grid container justify="center">
          <Grid item sm={12} md={6} container>
            <UserAvatarGrid
              alignItems="center"
              container
              item
              xs={12}
              direction="row"
              wrap="nowrap"
            >
              <UserAvatar />
              <UserAvatarSupplement>
                <div>Add a picture to</div>
                <div>personalize your avatar</div>
              </UserAvatarSupplement>
            </UserAvatarGrid>
            {formFieldDefinitions.map(renderFormFieldDefinition)}
            <Grid item xs={12}>
              <List>
                <ListItem divider>
                  <SectionTypography>Notifications</SectionTypography>
                </ListItem>
                {formSwitchDefinitions.map(renderFormSwitchDefinition)}
              </List>
            </Grid>
            <Grid item container xs={12} justify="flex-end">
              <Grid item sm={12} md={6}>
                <SubmitButton disabled={isSubmitting}>
                  {isSubmitting ? (
                    <CubesLoader size={24} color="#fff" />
                  ) : (
                    'Save'
                  )}
                </SubmitButton>
              </Grid>
            </Grid>
            <Grid item container xs={12} justify="flex-end">
              <PlainLink href="https://www.dock.health/privacy" target="_blank">
                Privacy Policy
              </PlainLink>
            </Grid>
          </Grid>
        </Grid>
      </FormContainer>
    </FormContext>
  );
};

const UserProfileViewAsync = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(store => store.userState.userProfile);
  const userNotificationPreferences = useSelector(store => ({
    emailNotificationsEnabled: store.userState.userNotificationPrefs.email,
    pushNotificationsEnabled: store.userState.userNotificationPrefs.push,
  }));

  useEffect(
    () => {
      userApi.getUserNotoficationPrefs();

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
      ({ key, defaultValue = '' }) => [
        key,
        (userNotificationPreferences || {})[key] ||
          (userProfile || {})[key] ||
          defaultValue,
      ],
    ),
  );

  return (
    <ViewContainer>
      <CubesLoaderOverlay className={loaderContainerClassName} />
      {userProfile && userNotificationPreferences && (
        <UserProfileView
          defaultValues={defaultValues}
          userProfile={userProfile}
          formContainerClassName={formContainerClassName}
        />
      )}
    </ViewContainer>
  );
};

export default UserProfileViewAsync;
