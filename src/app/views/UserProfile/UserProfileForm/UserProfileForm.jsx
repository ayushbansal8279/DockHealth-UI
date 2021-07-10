import { Grid } from '@material-ui/core';
import React, { useMemo } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Button from 'components/common/Button/Button';
import { head } from 'ramda';
import * as userApi from 'api/user-api';
import * as AlertActions from 'alert/actions';
import { openModal } from 'modal/actions';
import FormInput from 'components/common/Input/FormInput';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import UserAvatarUploader from 'views/UserProfile/UserAvatarUploader/UserAvatarUploader';
import Spacing from 'components/common/Spacing';
import validationSchema from './validation-schema';
import { FormInfoText, InputActionButton } from './styled';
import { SettingsSection, SectionHeader } from '../styled';

// eslint-disable-next-line unicorn/consistent-function-scoping
const onSubmit = ({ dispatch }) => async data => {
  try {
    const requestData = {
      firstName: data.firstName,
      lastName: data.lastName,
      titles: [{ name: data.title }],
      department: data.department,
      workPhoneNumber: data?.workPhoneNumber,
    };

    await userApi.updateUser(requestData);

    dispatch(
      AlertActions.showGlobalAlert('Profile updated successfully!', 'success'),
    );

    userApi.getUserById();
    userApi.getUserProfilePic(sessionStorage.userIdentifier, 'PROFILE');
  } catch (error) {
    console.error(error);
    dispatch(AlertActions.showGlobalAlert('Error updating profile', 'error'));
  }
};

const UserProfileForm = ({ userProfile }) => {
  const dispatch = useDispatch();

  const defaultValues = useMemo(() => {
    return {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      title: head(userProfile.titles || [])?.name,
      department: userProfile.department,
      email: userProfile.email,
      accountPhoneNumber: userProfile.accountPhoneNumber,
      workPhoneNumber: userProfile.workPhoneNumber,
    };
  }, [userProfile]);

  const formMethods = useForm({
    defaultValues,
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = formMethods;

  const openChangePasswordModal = () => {
    dispatch(openModal('ChangePassword'));
  };

  const openChangeMobileNumberModal = () => {
    dispatch(
      openModal('ChangeMobileNumber', {
        userProfile,
        onUpdateSuccess: updatedPhoneNumber => {
          setValue('accountPhoneNumber', updatedPhoneNumber);
          userApi.getUserById();
        },
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
            <Grid container item spacing={2}>
              <Grid item xs={12} md={6}>
                <FormInput
                  isRequired
                  type="text"
                  name="firstName"
                  label="First name"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormInput
                  isRequired
                  type="text"
                  name="lastName"
                  label="Last name"
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormInput readOnly type="email" name="email" label="Email" />
            </Grid>
            <Grid item xs={12}>
              <FormInput
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
            <Grid container item direction="row" spacing={2}>
              <Grid item md={6} xs={12}>
                <FormPhoneNumberInput
                  name="accountPhoneNumber"
                  label="Your Mobile Phone Number"
                  isRequired
                  readOnly
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
                <FormPhoneNumberInput
                  name="workPhoneNumber"
                  label="Additional Phone Number"
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item md={6} xs={12}>
                <FormInput name="title" label="Title" />
              </Grid>
              <Grid item md={6} xs={12}>
                <FormInput name="department" label="Department" />
              </Grid>
            </Grid>
          </Grid>
        </SettingsSection>
        <Grid container>
          <Grid item xs={12} md={4}>
            <Button fullWidth type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormContext>
  );
};

export default UserProfileForm;
