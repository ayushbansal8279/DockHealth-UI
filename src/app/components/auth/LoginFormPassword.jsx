import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useMount, useToggle } from 'react-use';
import styled from 'styled-components';
import { object, string } from 'yup';
import EyeClose from 'img/auth/eye-close.svg';
import EyeOpen from 'img/auth/eye-open.svg';
import { MontserratTypography } from 'styles/theme-montserrat';
import Button from 'components/common/Button/Button';
import Spacing from '../common/Spacing';
import { UniversalMontserratInput } from '../common/UniversalInput/UniversalInput';
import { StyledForm, StyledLink } from './AuthComponents.styled';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
  password: string().required('Please enter a password'),
});

const PasswordToggle = styled.div`
  cursor: pointer;
  padding: 0 0.75rem 0 0.5rem;

  & img {
    min-width: 1.25rem;
    object-fit: contain;
    object-position: center;
    width: 1.25rem;
  }
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
        <Spacing vertical={4} />
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
              <img
                src={isPasswordShown ? EyeOpen : EyeClose}
                alt={isPasswordShown ? 'Password shown' : 'Password hidden'}
              />
            </PasswordToggle>
          }
        />
        <Spacing vertical={5} />
        <Button id="loginButton" fullWidth size="large" type="submit">
          {unconfirmedUserFlag ? 'Resend confirmation Email' : 'Continue'}
        </Button>
        <Spacing vertical={6} />
        <MontserratTypography variant="h4">
          <StyledLink to="/auth/forgotPassword">FORGOT PASSWORD?</StyledLink>
        </MontserratTypography>
      </FormContext>
    </StyledForm>
  );
};

export default LoginFormPassword;
