import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { Link } from 'react-router';
import styled from 'styled-components';

import * as userApi from '../../api/user-api';
import CubesLoader from '../../components/common/CubesLoader';
import StyledInput from '../../components/userProfileView/StyledInput';
import StyledSwitch from '../../components/userProfileView/StyledSwitch';
import UserAvatar from '../../components/userProfileView/UserAvatar';
import {
  FormContainer,
  FormSwitchListItem,
  PlainLink,
  SectionSubtypography,
  SectionTypography,
  SubmitButton,
  UserAvatarGrid,
  UserProfileViewGrid,
} from '../../components/userProfileView/UserProfileView.Styled';
import { noop } from '../../helpers/utilityFunctions';
import {
  formFieldDefinitions,
} from './RegisterUser.FormDefinitions';
import validationSchema from '../UserProfileView.ValidationSchema';
import {
  BackgroundContainer,
  BackgroundModalContainer,
  BackgroundRectangleContainer,
  ContentContainer,
  DockLogo,
  DockLogoContainer,
  MainContentContainer,
  SmallBackgroundRectangleContainer,
} from '../TemplateAuthBase.styled';
import DrawerTitle from '../../components/drawer/DrawerTitle';

export const RegisterUserContainer = styled.div`
  background-color: #fff;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const TitleContainer = styled.div`
  align-items: center;
  background-color: #007cab;
  color: #000;
  display: flex;
  height: 50px;
  left: 100%;
  transition: top 0.2s ease-out;
  width: 100% ;
  z-index: 10;
`;

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
      fontSize={16}
      backgroundColor="#f3f5f6"
      gutterBottom
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

const RegisterUser = ({
  defaultValues,
  formContainerClassName,
  ...otherEntries
}) => {
  const formMethods = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues,
    validationSchema,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  return (
    <RegisterUserContainer>
      <TitleContainer>    
      </TitleContainer>
      <DockLogoContainer>
        <DockLogo src="assets/img/dock-logo.png" alt="Dock Health" />
      </DockLogoContainer>
    <div className="columns large-12">
      <h5 className="top-buffer">Welcome! Create your account.</h5>
    </div>

    <FormContext {...formMethods}>
      <FormContainer
        className={formContainerClassName}
        onSubmit={handleSubmit(
          isSubmitting ? noop : onSubmit({ ...otherEntries }),
        )}
      >
        <Grid container justify="center">
          <UserProfileViewGrid item sm={12} md={12} container>
            {formFieldDefinitions.map(renderFormFieldDefinition)}
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
              <div className="columns small-12 text-center top-buffer">
                <button
                  className={`button secondary expand`}
                  type="submit"
                >
                  Continue
                </button>
              </div>
              <div className="columns top-buffer small-6 text-left details">
                <>I already have an account.</>
                <Link to="/login">Sign in</Link>
                <>.</>
              </div>        
            </Grid>
          </UserProfileViewGrid>
        </Grid>
      </FormContainer>
    </FormContext>

    </RegisterUserContainer>
  );
};

export default RegisterUser;
