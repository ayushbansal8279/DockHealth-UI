import queryString from 'query-string';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import * as UserApi from 'api/user-api';
import CubesLoader from 'components/common/CubesLoader';
import Spacing from 'components/common/Spacing';
import { UniversalMontserratInput } from 'components/userProfileView/UniversalInput';
import { MontserratTypography } from 'app/theme-montserrat';
import { NextButton, StyledForm, StyledLink } from './AuthComponents.styled';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
});

const LoginFormUsername = ({ onSubmit }) => {
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
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

  const titleContent = window.sessionStorage.getItem('confirmStatus')
    ? 'Your email is confirmed'
    : 'Welcome back!';

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormContext {...formMethods}>
        {!showLoginMessage && (
          <>
            <MontserratTypography variant="h2">
              {titleContent}
            </MontserratTypography>
            <Spacing vertical={4} />
            <MontserratTypography variant="h3">
              Please sign in
            </MontserratTypography>
            <Spacing vertical={4} />
            <UniversalMontserratInput
              name="username"
              type="text"
              label="Email"
              autoFocus
            />
            <Spacing vertical={5} />
            <NextButton
              active
              id="loginButton"
              type="submit"
              variant="contained"
              color="primary"
            >
              Continue
            </NextButton>
            <Spacing vertical={6} />
            <MontserratTypography variant="h4">
              <span>New to Dock? </span>
              <StyledLink to="/onboarding/create-account">
                CREATE AN ACCOUNT
              </StyledLink>
            </MontserratTypography>
            <Spacing vertical={6} />
            <Spacing vertical={4} />
          </>
        )}
        {showLoginMessage && (
          <div>
            <MontserratTypography variant="h2">
              Signing you in...
            </MontserratTypography>
            <CubesLoader size={40} />
          </div>
        )}
      </FormContext>
    </StyledForm>
  );
};

export default LoginFormUsername;
