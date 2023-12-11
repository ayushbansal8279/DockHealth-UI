import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMount, useToggle } from 'react-use';
import styled from 'styled-components';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import EyeClose from 'img/auth/eye-close.svg';
import EyeOpen from 'img/auth/eye-open.svg';
import { MontserratTypography } from 'styles/theme-montserrat';
import Button from 'components/common/v2/Button/Button';
import FormInput from 'components/common/v2/Input/FormInput';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import { StyledForm, StyledLink } from './AuthComponents.styled';
import SSOOptions from './SSOOptions';
import { Title } from './Title';

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
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const [isPasswordShown, togglePasswordShown] = useToggle(false);

  const { watch, handleSubmit, setError, setValue } = formMethods;
  const usernameValue = watch('username');

  useMount(() => {
    setValue('username', sessionStorage.getItem('username') ?? '');
  });

  const titleContent = window.sessionStorage.getItem('confirmStatus')
    ? 'Your email is confirmed'
    : 'Sign in';

  const handleUsernameChange = (event) => {
    setValue('username', event.target?.value?.trim() || '');
    onChange(event);
  };

  return (
    <StyledForm
      onSubmit={handleSubmit(
        unconfirmedUserFlag
          ? onResendCode({ setError })
          : onSubmit({ setError }),
      )}
    >
      <FormProvider {...formMethods}>
        <Title>{titleContent}</Title>
        <Spacing vertical={4} />
        <MontserratTypography align="center" variant="h4">
          New to Dock?{' '}
          <a style={{ fontWeight: 600, color: 'black' }} href="/create-account">
            {' '}
            Sign up for free{' '}
          </a>
        </MontserratTypography>
        <Spacing vertical={5} />
        <FormInput
          name="username"
          type="text"
          label="Email"
          value={usernameValue}
          onChange={handleUsernameChange}
        />
        <Spacing vertical={4} />
        <FormInput
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
        <Button
          id="loginButton"
          fullWidth
          size="large"
          type="submit"
          color={palette.brightOrange}
          secondaryColor={palette.oPlusRed}
        >
          {unconfirmedUserFlag ? 'Resend confirmation Email' : 'Continue'}
        </Button>
        <Spacing vertical={4} />
        <MontserratTypography variant="h5" weight="bold">
          <StyledLink to="/auth/forgotPassword">FORGOT PASSWORD?</StyledLink>
        </MontserratTypography>
        <SSOOptions />
        <Spacing vertical={5} />
        <MontserratTypography
          variant="p"
          align="center"
          alignContent="center"
          alignItems="center"
        >
          Dock can save you 20 hours a month{' '}
          <a
            style={{ color: 'black', fontWeight: 800, paddingLeft: '5px' }}
            href="https://help.dock.health/"
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            Learn More
          </a>
        </MontserratTypography>
      </FormProvider>
    </StyledForm>
  );
};

export default LoginFormPassword;
