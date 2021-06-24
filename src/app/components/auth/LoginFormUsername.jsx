import queryString from 'query-string';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import * as UserApi from 'api/user-api';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { UniversalMontserratInput } from 'components/common/UniversalInput/UniversalInput';
import { MontserratTypography } from 'styles/theme-montserrat';
import { showAlert } from 'helpers/utility-functions';
import {
  StyledForm,
  // StyledLink,
  StyledHyperLink,
} from './AuthComponents.styled';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
});

// eslint-disable-next-line sonarjs/cognitive-complexity
const LoginFormUsername = props => {
  const { onSubmit } = props;
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

        const authCode = queryValues.code.replace('#/auth/login', '');
        let issValue = '';
        if (queryValues.iss) {
          issValue = queryValues.iss.replace('#/', '');
        }

        UserApi.getEnterpriseAccessTokensByAuthCode(authCode, issValue)
          .then(() => {
            const patientIdentifier = sessionStorage.getItem(
              'PatientIdentifier',
            );
            if (
              patientIdentifier &&
              patientIdentifier !== '' &&
              patientIdentifier !== 'null'
            ) {
              window.location.href = `/#/core/patient/${patientIdentifier}`;
            } else {
              window.location.href = '/#/core/home';
            }
            // setShowLoginMessage(false);
          })
          .catch(error => {
            showAlert({ status: 'error', title: 'Error', text: error.message });
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
            <Button id="loginButton" fullWidth size="large" type="submit">
              Continue
            </Button>
            {/* <Spacing vertical={6} />
            <MontserratTypography variant="h4">
              <span>New to Dock? </span>
              <StyledLink to="/auth/create-account">
                CREATE AN ACCOUNT
              </StyledLink>
            </MontserratTypography> */}
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
            <Spacing vertical={6} />
            <MontserratTypography variant="h4">
              <span>Trouble signing in? </span>
              <StyledHyperLink href="/#/auth/login">LOGIN</StyledHyperLink>
            </MontserratTypography>
          </div>
        )}
      </FormContext>
    </StyledForm>
  );
};

export default LoginFormUsername;
