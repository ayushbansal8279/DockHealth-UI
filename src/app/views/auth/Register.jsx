import Grid from '@material-ui/core/Grid';
import React from 'react';
import { hashHistory } from 'react-router';
import styled, { keyframes } from 'styled-components';

import { register } from '../../api/user-api';
import { noop } from '../../helpers/utility-functions';
import UserProfileView from '../UserProfileView';
import formFieldDefinitions from './Register.FormDefinitions';
import validationSchema from './Register.ValidationSchema';

const onFormSubmit = async data => {
  const {
    firstName,
    lastName,
    title,
    email,
    accountPhoneNumber,
    password,
  } = data;

  try {
    await register({
      username: email,
      password,
      email,
      phone_number: `+1${accountPhoneNumber.replace(/\D/g, '')}`,
      family_name: lastName,
      given_name: firstName,
      'custom:title': title,
    });

    hashHistory.push('login');
  } catch {
    noop();
  }
};

const viewContainerAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(1rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const RegisterViewContainer = styled.div`
  background-color: #fff;
  min-height: calc(100vh - 5.5rem);
  padding: 4rem 0 2rem;

  > * {
    animation: ${viewContainerAnimation} 0.3s 0s ease-out forwards;
  }
`;

const RegisterTopBar = styled.div`
  background-color: #007cab;
  height: 5.5rem;
  width: 100%;
`;

const RegisterTopLabel = styled.div`
  color: #2e3a43;
  font-size: 2.25rem;
  margin-bottom: 0.75rem;
  margin-top: 1rem;
  text-align: center;
`;

const RegisterBottomLabel = styled.div`
  color: #2e3a43;
  font-size: 1.3125rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export default () => (
  <>
    <RegisterTopBar />
    <RegisterViewContainer>
      <Grid container justify="center">
        <Grid item container justify="center" xs={12}>
          <img src="/assets/img/dock-logo-mini.png" alt="Dock Health icon" />
        </Grid>
        <Grid item container justify="center" xs={12}>
          <RegisterTopLabel>Welcome, create your account</RegisterTopLabel>
        </Grid>
        <Grid item container justify="center" xs={6}>
          <RegisterBottomLabel>
            Dock Health is a simple, HIPAA compliant platform for managing
            clinical tasks as a team. Our mission is to offer a better way
            <strong> to-do </strong>
            healthcare.
          </RegisterBottomLabel>
        </Grid>
      </Grid>
      <UserProfileView
        defaultValues={{}}
        formContainerClassName=""
        formFieldDefinitions={formFieldDefinitions}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}
        showSignInLabel
        renderAvatarUploader={false}
        saveButtonProps={{
          label: 'Continue',
          style: {
            backgroundColor: '#d9036b',
            fontWeight: 'normal',
          },
        }}
      />
    </RegisterViewContainer>
  </>
);
