import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React from 'react';
import useForm, { FormContext } from 'react-hook-form';

import * as userApi from '../api/user-api';
import CubesLoader from '../components/common/CubesLoader';
import StyledInput from '../components/userProfileView/StyledInput';
import StyledSwitch from '../components/userProfileView/StyledSwitch';
import UserAvatar from '../components/userProfileView/UserAvatar';
import {
  FormContainer,
  FormSwitchListItem,
  PlainLink,
  SectionSubtypography,
  SectionTypography,
  SubmitButton,
  UserAvatarGrid,
  UserAvatarSupplement,
} from '../components/userProfileView/UserProfileView.Styled';
import { noop } from '../helpers/utilityFunctions';
import {
  formFieldDefinitions,
  formSwitchDefinitions,
} from './UserProfileView.FormDefinitions';
import validationSchema from './UserProfileView.ValidationSchema';

const renderFormFieldDefinition = ({
  key,
  label,
  required = false,
  readOnly = false,
  type = 'text',
  isPhoneNumber = false,
}) => (
  <Grid key={key} item xs={12}>
    <StyledInput
      type={type}
      name={key}
      label={label}
      required={required}
      readOnly={readOnly}
      isPhoneNumber={isPhoneNumber}
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

const onSubmit = ({
  otherSpecialty,
  otherSubspecialty,
  otherTitle,
}) => async data => {
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

const UserProfileView = ({
  defaultValues,
  formContainerClassName,
  ...otherEntries
}) => {
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
        onSubmit={handleSubmit(
          isSubmitting ? noop : onSubmit({ ...otherEntries }),
        )}
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
              <PlainLink
                topPadded
                href="https://www.dock.health/privacy"
                target="_blank"
              >
                Privacy Policy
              </PlainLink>
            </Grid>
          </Grid>
        </Grid>
      </FormContainer>
    </FormContext>
  );
};

export default UserProfileView;
