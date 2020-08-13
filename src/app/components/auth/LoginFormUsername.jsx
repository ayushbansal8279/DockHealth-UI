import queryString from 'query-string';
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import * as UserApi from 'api/user-api';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import { UniversalMontserratInput } from 'components/userProfileView/UniversalInput';
import { MontserratTypography } from 'styles/theme-montserrat';
import { showAlert } from 'helpers/utility-functions';
import { NextButton, StyledForm, StyledLink } from './AuthComponents.styled';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
});

const LoginFormUsername = props => {
  const { onSubmit, userEmail } = props;
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit, setValue } = formMethods;

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
            showAlert({ status: 'error', title: 'Error', text: error.message });
          });
      }
    }
  });

  useEffect(() => {
    if (userEmail) {
      setValue('username', userEmail);
    }
  }, [setValue, userEmail]);

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
            <Spacing vertical={4} />
            <Loader size={LoaderSizes.big} />
          </div>
        )}
      </FormContext>
    </StyledForm>
  );
};

export default LoginFormUsername;
