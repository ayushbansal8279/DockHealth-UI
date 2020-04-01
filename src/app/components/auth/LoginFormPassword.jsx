import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useMount, useToggle } from 'react-use';
import styled from 'styled-components';
import { object, string } from 'yup';
import { MontserratTypography } from '../../theme-montserrat';
import Spacing from '../common/Spacing';
import { UniversalMontserratInput } from '../userProfileView/UniversalInput';
import { NextButton, StyledForm, StyledLink } from './AuthComponents.styled';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
  password: string().required('Please enter a password'),
});

const PasswordToggle = styled.div`
  cursor: pointer;
  padding: 0 0.5rem;
`;

const LoginFormPassword = ({
  onSubmit,
  onResendCode,
  onChange,
  unconfirmedUserFlag,
}) => {
  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const [isPasswordShown, togglePasswordShown] = useToggle(false);

  const { handleSubmit, setError, setValue } = formMethods;

  useMount(() => {
    setValue('username', sessionStorage.getItem('username') ?? '');
  });

  const titleContent = window.sessionStorage.getItem('confirmStatus')
    ? 'Your email is confirmed'
    : 'Welcome back!';

  return (
    <StyledForm
      onSubmit={handleSubmit(
        unconfirmedUserFlag
          ? onResendCode({ setError })
          : onSubmit({ setError }),
      )}
    >
      <FormContext {...formMethods}>
        <MontserratTypography variant="h2">{titleContent}</MontserratTypography>
        <MontserratTypography variant="h3">Please sign in</MontserratTypography>
        <Spacing vertical={4} />
        <UniversalMontserratInput
          name="username"
          type="text"
          label="Email"
          onChange={onChange}
        />
        <Spacing vertical={4} />
        <UniversalMontserratInput
          name="password"
          type={isPasswordShown ? 'text' : 'password'}
          label="Password"
          autoFocus
          onChange={onChange}
          endAdornment={
            <PasswordToggle onClick={togglePasswordShown}>
              <MontserratTypography variant="h5">
                {isPasswordShown ? 'Hide' : 'Show'}
              </MontserratTypography>
            </PasswordToggle>
          }
        />
        <Spacing vertical={5} />
        <NextButton
          active
          id="loginButton"
          type="submit"
          variant="contained"
          color="primary"
        >
          {unconfirmedUserFlag ? 'Resend confirmation Email' : 'Continue'}
        </NextButton>
        <Spacing vertical={4} />
        <MontserratTypography variant="h5">
          <StyledLink to="/forgotPassword">FORGOT PASSWORD?</StyledLink>
        </MontserratTypography>
      </FormContext>
    </StyledForm>
  );
};

export default LoginFormPassword;
