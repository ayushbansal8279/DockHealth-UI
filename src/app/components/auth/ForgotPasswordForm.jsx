import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useMount } from 'react-use';

import { object, string } from 'yup';
import { FormContext, useForm } from 'react-hook-form';
import {
  HeightDependentGrid,
  NextButton,
  TitleTypography,
} from './AuthComponents.styled';
import AuthFieldHooks from '../common/AuthFieldHooks';

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

  const { handleSubmit, setValue } = formMethods;

  useMount(() => {
    setValue('username', sessionStorage.getItem('username') ?? ''); // TODO Figure out how to use SessionStorage like this.
  });

  return (
    <form className="inline-label top-buffer" onSubmit={handleSubmit(onSubmit)}>
      <FormContext {...formMethods}>
        <Grid container>
          <TitleTypography variant="h2" style={{ marginTop: '3em' }}>
            Forgot your password?
          </TitleTypography>
          <HeightDependentGrid size={9}>
            <TitleTypography variant="h4">
              Don’t worry, it happens to the best of us. Enter the email
              associated with your account.
            </TitleTypography>
          </HeightDependentGrid>
          <HeightDependentGrid size={9}>
            <AuthFieldHooks
              name="username"
              type="text"
              label="Email"
              autoFocus
            />
          </HeightDependentGrid>
          <HeightDependentGrid size={9}>
            <NextButton
              active
              id="loginButton"
              type="submit"
              variant="contained"
              color="primary"
              style={{
                marginTop: '3rem',
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
