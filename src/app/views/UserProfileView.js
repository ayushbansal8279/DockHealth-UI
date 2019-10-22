import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React, { useEffect } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import * as userApi from '../api/user-api';
import CubesLoader from '../components/common/CubesLoader';
import CubesLoaderOverlay from '../components/common/CubesLoaderOverlay';
import StyledInput from '../components/userProfileView/StyledInput';
import StyledSwitch from '../components/userProfileView/StyledSwitch';
import {
  FormContainer,
  SectionSubtypography,
  SectionTypography,
  SubmitButton,
  ViewContainer,
} from '../components/userProfileView/UserProfileView.Styled';
import { noop } from '../helpers/utilityFunctions';
import {
  formFieldDefinitions,
  formSwitchDefinitions,
} from './UserProfileView.FormDefinitions';
import validationSchema from './UserProfileView.ValidationSchema';
import UserAvatar from '../components/userProfileView/UserAvatar';

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
  <ListItem key={key}>
    <Grid container alignItems="flex-start" justify="space-between">
      <div>
        <SectionTypography>{label}</SectionTypography>
        {sublabels.map(sublabel => (
          <SectionSubtypography key={sublabel}>{sublabel}</SectionSubtypography>
        ))}
      </div>
      <StyledSwitch name={key} />
    </Grid>
  </ListItem>
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
            <Grid item xs={12}>
              <UserAvatar />
            </Grid>
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
          </Grid>
        </Grid>
      </FormContainer>
    </FormContext>
  );
};

const UserProfileViewAsync = () => {
  const userProfile = useSelector(store => store.userState.userProfile);
  const userNotificationPrefs = useSelector(store => ({
    emailNotificationsEnabled: store.userState.userNotificationPrefs.email,
    pushNotificationsEnabled: store.userState.userNotificationPrefs.push,
  }));

  useEffect(() => {
    userApi.getUserNotoficationPrefs();
  }, []);

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
        (userNotificationPrefs || {})[key] ||
          (userProfile || {})[key] ||
          defaultValue,
      ],
    ),
  );

  return (
    <ViewContainer>
      <CubesLoaderOverlay className={loaderContainerClassName} />
      {userProfile && userNotificationPrefs && (
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
