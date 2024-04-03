import queryString from 'query-string';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as UserAuthApi from 'api/user-auth-api';
import FormInput from 'components/common/v2/Input/FormInput';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/v2/Button/Button';
import { showAlert } from 'helpers/utility-functions';
import palette from 'styles/palette';
import { OutfitTypography } from 'styles/theme-outfit';
import { StyledForm, StyledHyperLink } from './AuthComponents.styled';
import { Title, Subtitle } from './Title';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
});

// eslint-disable-next-line sonarjs/cognitive-complexity
const LoginFormUsername = (props) => {
  const { onSubmit } = props;
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const { watch, setValue, handleSubmit } = formMethods;
  const usernameValue = watch('username');

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

        UserAuthApi.getEnterpriseAccessTokensByAuthCode(authCode, issValue)
          .then(() => {
            sessionStorage.setItem('sessionStartTime', new Date().getTime());
            const nextPathname = sessionStorage.getItem('next-page');
            console.log(nextPathname);
            if (nextPathname && nextPathname !== '') {
              sessionStorage.removeItem('next-page');
              window.location.href = `/#${nextPathname}`;
              return;
            }
            const patientIdentifier =
              sessionStorage.getItem('PatientIdentifier');
            console.log(patientIdentifier);
            window.location.href =
              patientIdentifier &&
              patientIdentifier !== '' &&
              patientIdentifier !== 'null'
                ? `/#/core/patient/${patientIdentifier}`
                : '/#/core/home';
            // setShowLoginMessage(false);
          })
          .catch((error) => {
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
      <FormProvider {...formMethods}>
        {!showLoginMessage && (
          <>
            <Title>{titleContent}</Title>
            <Spacing vertical={4} />
            <Subtitle>Please sign in</Subtitle>
            <Spacing vertical={4} />
            <FormInput
              name="username"
              type="text"
              label="Email"
              autoFocus
              value={usernameValue}
              onChange={(event) =>
                setValue('username', event.target?.value?.trim() || '')
              }
            />
            <Spacing vertical={5} />
            <Button
              uppercase={false}
              id="loginButton"
              fullWidth
              size="large"
              type="submit"
              color={palette.brightOrange}
              secondaryColor={palette.oPlusRed}
            >
              Continue
            </Button>
          </>
        )}
        {showLoginMessage && (
          <div>
            <OutfitTypography variant="h3">Signing you in</OutfitTypography>
            <Spacing vertical={4} />
            <Loader size={LoaderSizes.big} />
            <Spacing vertical={6} />
            <OutfitTypography variant="h4">
              <span>Trouble signing in? </span>
              <StyledHyperLink href="/#/auth/login">LOGIN</StyledHyperLink>
            </OutfitTypography>
          </div>
        )}
      </FormProvider>
    </StyledForm>
  );
};

export default LoginFormUsername;
