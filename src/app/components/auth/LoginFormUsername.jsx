import queryString from 'query-string';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import * as UserApi from '../../api/user-api';
import AuthFieldHooks from '../common/AuthFieldHooks';
import CubesLoader from '../common/CubesLoader';
import {
  BottomGridContainer,
  FieldItemContainer,
  HeightDependentGrid,
  NextButton,
  StyledForm,
  StyledLabel,
  TitleTypography,
} from './AuthComponents.styled';
import { useSmallScreen } from '../../helpers/utility-functions';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
});

const LoginFormUsername = ({ onSubmit }) => {
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const formMethods = useForm({
    validationSchema,
  });

  const { handleSubmit } = formMethods;

  useMount(() => {
    if (window.location.href) {
      const queryValues = queryString.parse(window.location.search);

      if (queryValues.code !== undefined) {
        setShowLoginMessage(true);

        const authCode = queryValues.code.replace('#/login', '');

        UserApi.getEnterpriseAccessTokensByAuthCode(authCode)
          .then(() => {
            window.location.href = '/#/tasks';
            setShowLoginMessage(false);
          })
          .catch(error => {
            toggleAlert(error.message, 'error');
          });
      }
    }
  });

  const isSmallScreen = useSmallScreen();

  const titleContent = window.sessionStorage.getItem('confirmStatus')
    ? 'Your email is confirmed'
    : 'Welcome to Dock Health';

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormContext {...formMethods}>
        {!showLoginMessage && (
          <>
            <TitleTypography
              variant="h2"
              isSmallScreen={isSmallScreen}
              style={{ marginTop: isSmallScreen ? '1em' : '3em' }}
            >
              {titleContent}
            </TitleTypography>
            <TitleTypography variant="h4">
              Please sign in to your account
            </TitleTypography>
            <FieldItemContainer>
              <HeightDependentGrid size={isSmallScreen ? 12 : 9}>
                <AuthFieldHooks
                  name="username"
                  type="text"
                  label="Email"
                  autoFocus
                />
              </HeightDependentGrid>
            </FieldItemContainer>

            <div>
              <HeightDependentGrid size={isSmallScreen ? 12 : 6}>
                <NextButton
                  active
                  id="loginButton"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Next
                </NextButton>
              </HeightDependentGrid>
            </div>
            <BottomGridContainer>
              <StyledLabel bold>Don’t have an account yet?</StyledLabel>
              <StyledLabel>
                <Link to="/onboarding/create-account">Create account</Link>
              </StyledLabel>
            </BottomGridContainer>
          </>
        )}
        {showLoginMessage && (
          <div>
            <TitleTypography
              variant="h2"
              style={{ marginTop: isSmallScreen ? '1em' : '3em' }}
            >
              Signing you in...
            </TitleTypography>
            <CubesLoader size={40} />
          </div>
        )}
      </FormContext>
    </StyledForm>
  );
};

export default LoginFormUsername;
