import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { MontserratTypography } from '../../theme-montserrat';
import Spacing from '../common/Spacing';
import { UniversalInput } from '../userProfileView/UniversalInput';
import { NextButton, StyledLink } from './AuthComponents.styled';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
});

const ForgotPasswordForm = ({
  onSubmit,
  onResendCode,
  unconfirmedUserFlag,
}) => {
  const formMethods = useForm({
    reValidateMode: 'onSubmit',
    validationSchema,
  });

  const { handleSubmit, setValue, setError } = formMethods;

  useMount(() => {
    setValue('username', sessionStorage.getItem('username') ?? '');
  });

  return (
    <form
      onSubmit={handleSubmit(
        unconfirmedUserFlag
          ? onResendCode({ setError })
          : onSubmit({ setError }),
      )}
      style={{
        width: '100%',
      }}
    >
      <FormContext {...formMethods}>
        <MontserratTypography variant="h2">
          Forgot your password?
        </MontserratTypography>
        <MontserratTypography variant="h4">
          Don’t worry, it happens to the best of us.
        </MontserratTypography>
        <MontserratTypography variant="h4">
          Enter the email associated with your account.
        </MontserratTypography>
        <Spacing vertical={4} />
        <UniversalInput name="username" type="text" label="Email" autoFocus />
        <Spacing vertical={5} />
        <NextButton type="submit" variant="contained">
          {unconfirmedUserFlag
            ? 'Resend confirmation Email'
            : 'Send me a recovery code'}
        </NextButton>
        <Spacing vertical={6} />
        <MontserratTypography variant="h5">
          <span>Want to change your email? </span>
          <StyledLink to="/onboarding/create-account">
            Recreate account
          </StyledLink>
        </MontserratTypography>
      </FormContext>
    </form>
  );
};

export default ForgotPasswordForm;
