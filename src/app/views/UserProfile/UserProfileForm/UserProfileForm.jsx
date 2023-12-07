import { Grid } from '@mui/material';
import React, { useMemo, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/common/Button/Button';
import head from 'ramda/src/head';
import { getCurrentUser, updateCurrentUser } from 'actions/user-actions';
import { openModal } from 'modal/actions';
import FormInput from 'components/common/Input/FormInput';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import AvatarInput from 'components/user/AvatarInput/AvatarInput';
import { getUserAvatarThumbnailUrl } from 'helpers/user-helper';
import Spacing from 'components/common/Spacing';
import ColorPicker from 'components/common/ColorPicker/ColorPicker';
import InitialsInput from 'components/common/InitialsInput/InitialsInput';
import validationSchema from './validation-schema';
import {
  FormInfoText,
  InputActionButton,
  OuterAvatarContainer,
  UserAvatarSupplement,
  SectionTitle,
  StyledForm,
} from './styled';
import { SettingsSection, SectionHeader } from '../styled';

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
      initials: userProfile?.initials,
      bubbleColor: userProfile?.bubbleColor,
    };
  }, [userProfile]);

  const formMethods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    register,
    unregister,
    watch,
  } = formMethods;

  useEffect(() => {
    register('bubbleColor');
    register('initials');
    register('avatar');

    return () => {
      unregister('bubbleColor');
      unregister('initials');
      unregister('avatar');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avatarColorValue = watch('bubbleColor');
  const initialsValue = watch('initials');
  const avatarValue = watch('avatar');

  const embeddedMode = sessionStorage.getItem('EmbeddedMode') || false;

  const openChangePasswordModal = () => {
    dispatch(openModal('ChangePassword'));
  };

  const openChangeMobileNumberModal = () => {
    dispatch(
      openModal('ChangeMobileNumber', {
        userProfile,
        onUpdateSuccess: (updatedPhoneNumber) => {
          setValue('accountPhoneNumber', updatedPhoneNumber);
          dispatch(getCurrentUser());
        },
      }),
    );
  };

  const openChangeEmailModal = () => {
    dispatch(
      openModal('ChangeEmail', {
        userProfile,
        onUpdateSuccess: updatedPhoneNumber => {
          setValue('accountPhoneNumber', updatedPhoneNumber);
          dispatch(getCurrentUser());
        },
      }),
    );
  };

  return (
    <FormProvider {...formMethods}>
      <StyledForm
        onSubmit={handleSubmit((data) =>
          dispatch(
            updateCurrentUser({
              ...data,
              userIdentifier: userProfile.identifier,
            }),
          ),
        )}
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
              <OuterAvatarContainer>
                <AvatarInput
                  name="userAvatar"
                  pictureSrc={
                    avatarValue === undefined
                      ? getUserAvatarThumbnailUrl(userProfile)
                      : avatarValue
                  }
                  initials={initialsValue}
                  color={avatarColorValue}
                  onChange={(newAvatar) => {
                    setValue('avatar', newAvatar);
                  }}
                />
                {!userProfile.profileThumbnailPictureHash && (
                  <UserAvatarSupplement>
                    <div>Add a picture to</div>
                    <div>personalize your avatar</div>
                  </UserAvatarSupplement>
                )}
              </OuterAvatarContainer>
            </Grid>
            <Spacing vertical={4} />
            <SectionTitle>Select Initials for your profile</SectionTitle>
            <InitialsInput
              name="initials"
              placeholder="ab"
              value={initialsValue}
              onChange={(v) => {
                setValue('initials', v);
              }}
              maxChar={2}
            />
            <Spacing vertical={4} />
            <SectionTitle>Choose a color for your profile</SectionTitle>
            <ColorPicker
              name="bubbleColor"
              value={avatarColorValue}
              onChange={(event) => {
                const { name, value } = event.target;
                setValue(name, value);
              }}
            />
            <Spacing vertical={4} />
            {!embeddedMode && (
              <>
                <Grid container item spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormInput
                      required
                      type="text"
                      name="firstName"
                      label="First name"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormInput
                      required
                      type="text"
                      name="lastName"
                      label="Last name"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <FormInput
                    readOnly
                    type="email"
                    name="email"
                    label="Email"
                    // endAdornment={
                    //   <InputActionButton
                    //     type="button"
                    //     onClick={openChangeEmailModal}
                    //   >
                    //     Change
                    //   </InputActionButton>
                    // }
                  />
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
                      required
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
              </>
            )}
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
      </StyledForm>
    </FormProvider>
  );
};

export default UserProfileForm;
