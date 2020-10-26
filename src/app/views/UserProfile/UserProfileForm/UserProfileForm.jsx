import { Grid } from '@material-ui/core';
import React, { useMemo } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Button from 'components/common/Button/Button';
import { FormSwitch } from 'components/common/Switch/Switch';
import { head } from 'ramda';
import * as userApi from 'api/user-api';
import * as AlertActions from 'alert/actions';
import { openModal } from 'modal/actions';
import {
  UniversalInput,
  UniversalMobileInputComponent,
} from 'components/common/UniversalInput/UniversalInput';
import UserAvatarUploader from 'views/UserProfile/UserAvatarUploader/UserAvatarUploader';
import Spacing from 'components/common/Spacing';
import validationSchema from './validation-schema';
import {
  SectionSubtypography,
  SectionTypography,
  FormInfoText,
  InputActionButton,
} from './styled';
import { SettingsSection, SectionHeader } from '../styled';

const onSubmit = ({ dispatch }) => async data => {
  const { emailNotificationsEnabled, ...otherData } = data;

  try {
    const requestData = {
      firstName: otherData.firstName,
      lastName: otherData.lastName,
      titles: [{ name: otherData.title }],
      department: otherData.department,
      workPhoneNumber:
        otherData?.workPhoneNumber?.replace(/[\s()-]/g, '') || '',
    };

    await userApi.updateUser(requestData);
    await userApi.updateUserNotoficationPrefs(emailNotificationsEnabled);

    dispatch(
      AlertActions.showGlobalAlert('Profile updated successfully!', 'success'),
    );

    userApi.getUserById();
    userApi.getUserProfilePic(sessionStorage.userIdentifier, 'PROFILE');
    userApi.getUserNotoficationPrefs();
  } catch (error) {
    console.error(error);
    dispatch(AlertActions.showGlobalAlert('Error updating profile', 'error'));
  }
};

const UserProfileForm = ({ userProfile, userNotificationPreferences }) => {
  const dispatch = useDispatch();

  const defaultValues = useMemo(() => {
    return {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      title: head(userProfile.titles || [])?.name,
      department: userProfile.department,
      email: userProfile.email,
      accountPhoneNumber: userProfile.accountPhoneNumber
        ? userProfile.accountPhoneNumber
            .replace(/^\+1/, '')
            .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
        : userProfile.accountPhoneNumber,
      workPhoneNumber: userProfile.workPhoneNumber
        ? userProfile.workPhoneNumber
            .replace(/^\+1/, '')
            .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
        : '',
      emailNotificationsEnabled:
        userNotificationPreferences.emailNotificationsEnabled || false,
    };
  }, [userProfile, userNotificationPreferences]);

  const formMethods = useForm({
    defaultValues,
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const openChangePasswordModal = () => {
    dispatch(openModal('ChangePassword'));
  };

  const openChangeMobileNumberModal = () => {
    dispatch(
      openModal('ChangeMobileNumber', {
        userProfile,
        onUpdateSuccess: userApi.getUserById,
      }),
    );
  };

  return (
    <FormContext {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit({ dispatch }))}
        autoComplete="off"
        autoCorrect="off"
      >
        <SettingsSection>
          <SectionHeader>My profile</SectionHeader>
          <Spacing vertical={5} />
          <Grid container spacing={2}>
            <Grid
              alignItems="center"
              container
              item
              xs={12}
              direction="row"
              wrap="nowrap"
            >
              <UserAvatarUploader />
            </Grid>
            <Spacing vertical={4} />
            <Grid container item alignItems="flex-end" spacing={2}>
              <Grid item xs={12} md={6}>
                <UniversalInput
                  type="text"
                  name="firstName"
                  label="First name"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <UniversalInput
                  type="text"
                  name="lastName"
                  label="Last name"
                  required
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <UniversalInput
                type="email"
                name="email"
                label="Email"
                readOnly
              />
            </Grid>
            <Grid item xs={12}>
              <UniversalInput
                type="password"
                label="Password"
                readOnly
                value="password"
                endAdornment={
                  <InputActionButton
                    type="button"
                    onClick={openChangePasswordModal}
                  >
                    Change
                  </InputActionButton>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormInfoText>
                A valid mobile phone number is required to send an
                authentication code for HIPAA compliance
              </FormInfoText>
            </Grid>
            <Grid
              container
              item
              direction="row"
              alignItems="flex-end"
              spacing={2}
            >
              <Grid item md={6} xs={12}>
                <UniversalInput
                  name="accountPhoneNumber"
                  label="Your Mobile Phone Number"
                  required
                  readOnly
                  CustomComponent={UniversalMobileInputComponent}
                  endAdornment={
                    <InputActionButton
                      type="button"
                      onClick={openChangeMobileNumberModal}
                    >
                      Change
                    </InputActionButton>
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <UniversalInput
                  name="workPhoneNumber"
                  label="Additional Phone Number"
                  CustomComponent={UniversalMobileInputComponent}
                />
              </Grid>
            </Grid>
            <Grid
              container
              item
              direction="row"
              alignItems="flex-end"
              spacing={2}
            >
              <Grid item md={6} xs={12}>
                <UniversalInput name="title" label="Title" />
              </Grid>
              <Grid item md={6} xs={12}>
                <UniversalInput name="department" label="Department" />
              </Grid>
            </Grid>
          </Grid>
        </SettingsSection>
        <SettingsSection>
          <SectionHeader>Preferences</SectionHeader>
          <Spacing vertical={5} />
          <Grid container spacing={2}>
            <Grid
              container
              item
              alignItems="flex-start"
              justify="space-between"
            >
              <div>
                <SectionTypography>Emails</SectionTypography>
                <SectionSubtypography>
                  Notify me via email when there is a new activity.
                </SectionSubtypography>
              </div>
              <FormSwitch name="emailNotificationsEnabled" />
            </Grid>
          </Grid>
        </SettingsSection>
        <Grid container justify="flex-end">
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={isSubmitting}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormContext>
  );
};

export default UserProfileForm;
