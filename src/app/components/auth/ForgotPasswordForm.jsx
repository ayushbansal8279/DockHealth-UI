import { Grid } from '@material-ui/core';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { useSmallScreen } from '../../helpers/utility-functions';
import AuthFieldHooks from '../common/AuthFieldHooks';
import {
  BottomGridContainer,
  HeightDependentGrid,
  NextButton,
  StyledLabel,
  TitleTypography,
} from './AuthComponents.styled';

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

  const isSmallScreen = useSmallScreen();

  return (
    <form
      onSubmit={handleSubmit(
        unconfirmedUserFlag
          ? onResendCode({ setError })
          : onSubmit({ setError }),
      )}
    >
      <FormContext {...formMethods}>
        <Grid container>
          <TitleTypography
            variant="h2"
            style={{ marginTop: isSmallScreen ? '.5em' : '1em' }}
            isSmallScreen={isSmallScreen}
          >
            Forgot your password?
          </TitleTypography>
          <HeightDependentGrid size={isSmallScreen ? 12 : 9}>
            <TitleTypography variant="h4">
              Don’t worry, it happens to the best of us. Enter the email
              associated with your account.
            </TitleTypography>
          </HeightDependentGrid>
          <HeightDependentGrid size={isSmallScreen ? 12 : 9}>
            <AuthFieldHooks
              name="username"
              type="text"
              label="Email"
              autoFocus
            />
          </HeightDependentGrid>
          <HeightDependentGrid size={isSmallScreen ? 12 : 9}>
            <NextButton
              active
              id="loginButton"
              type="submit"
              variant="contained"
              color="primary"
              style={{
                marginTop: isSmallScreen ? '1em' : '3em',
              }}
            >
              {unconfirmedUserFlag === true
                ? 'Resend confirmation Email'
                : 'Send me a recovery code'}
            </NextButton>
          </HeightDependentGrid>
        </Grid>
      </FormContext>
      <BottomGridContainer style={{ marginTop: '100px' }}>
        <StyledLabel bold>Want to change your email?</StyledLabel>
        <StyledLabel>
          <Link to="/onboarding/create-account">Recreate account</Link>
        </StyledLabel>
      </BottomGridContainer>
    </form>
  );
};

export default ForgotPasswordForm;
