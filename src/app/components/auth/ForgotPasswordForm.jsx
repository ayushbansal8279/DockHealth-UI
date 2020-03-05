import Grid from '@material-ui/core/Grid';
import React from 'react';

import { object, string } from 'yup';
import { FormContext, useForm } from 'react-hook-form';
import {
  HeightDependentGrid,
  NextButton,
  TitleTypography,
} from './AuthComponents.styled';
import AuthFieldHooks from '../common/AuthFieldHooks';
import { useSmallScreen } from '../../helpers/utility-functions';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
});

const ForgotPasswordForm = ({ onSubmit }) => {
  const formMethods = useForm({
    reValidateMode: 'onSubmit',
    validationSchema,
  });

  const { handleSubmit } = formMethods;

  const isSmallScreen = useSmallScreen();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
              Send me a recovery code
            </NextButton>
          </HeightDependentGrid>
        </Grid>
      </FormContext>
    </form>
  );
};

export default ForgotPasswordForm;
