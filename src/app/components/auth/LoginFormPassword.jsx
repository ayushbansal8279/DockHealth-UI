import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { useSmallScreen } from '../../helpers/utility-functions';
import AuthFieldHooks from '../common/AuthFieldHooks';
import {
  BottomGridContainer,
  FieldItemContainer,
  HeightDependentGrid,
  NextButton,
  StyledForm,
  StyledLabel,
  TitleTypography,
} from './AuthComponents.styled';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
  password: string().required('Please enter a password'),
});

const LoginFormPassword = ({
  onSubmit,
  onResendCode,
  onChange,
  unconfirmedUserFlag,
}) => {
  const formMethods = useForm({
    validationSchema,
  });

  const { handleSubmit, setError, setValue } = formMethods;

  useMount(() => {
    setValue('username', sessionStorage.getItem('username') ?? '');
  });

  const isSmallScreen = useSmallScreen();

  const titleContent = window.sessionStorage.getItem('confirmStatus')
    ? 'Your email is confirmed'
    : 'Welcome to Dock Health';

  const buttonColSize = unconfirmedUserFlag ? 9 : 6;

  return (
    <StyledForm
      onSubmit={handleSubmit(
        unconfirmedUserFlag
          ? onResendCode({ setError })
          : onSubmit({ setError }),
      )}
    >
      <FormContext {...formMethods}>
        <TitleTypography
          variant="h2"
          style={{ marginTop: isSmallScreen ? '.5em' : '1em' }}
          isSmallScreen={isSmallScreen}
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
              onChange={onChange}
            />
          </HeightDependentGrid>
          <HeightDependentGrid size={isSmallScreen ? 12 : 9}>
            <AuthFieldHooks
              name="password"
              type="password"
              label="Password"
              autoFocus
              onChange={onChange}
            />
          </HeightDependentGrid>
        </FieldItemContainer>

        <div>
          <HeightDependentGrid size={isSmallScreen ? 12 : buttonColSize}>
            <NextButton
              active
              id="loginButton"
              type="submit"
              variant="contained"
              color="primary"
            >
              {unconfirmedUserFlag === true
                ? 'Resend confirmation Email'
                : 'Next'}
            </NextButton>
          </HeightDependentGrid>
        </div>

        <BottomGridContainer>
          <StyledLabel>
            <Link to="/forgotPassword">Forgot password?</Link>
          </StyledLabel>
        </BottomGridContainer>
      </FormContext>
    </StyledForm>
  );
};

export default LoginFormPassword;
