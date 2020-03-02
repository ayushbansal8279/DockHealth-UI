import Grid from '@material-ui/core/Grid';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import AuthFieldHooks from '../common/AuthFieldHooks';
import { NextButton, TitleTypography } from './AuthComponents.styled';

const MIN_PASSWORD_LENGTH = 8;

const validationSchema = object().shape({
  // code: string().required('Authorization code is required'),
  password: string()
    .required('Password is required')
    .min(
      MIN_PASSWORD_LENGTH,
      `Password needs to be at least ${MIN_PASSWORD_LENGTH} characters long`,
    )
    .matches(/\d/, 'Password needs at least 1 number')
    .matches(/[A-Z]/, 'Password needs at least 1 capital letter'),
});

const ResetPasswordForm = ({ authTokenReceived, onSubmit }) => {
  const formMethods = useForm({
    reValidateMode: 'onSubmit',
    validationSchema,
  });

  const { handleSubmit } = formMethods;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContext {...formMethods}>
        <Grid container>
          <TitleTypography variant="h2" style={{ marginTop: '3em' }}>
            Let’s set a new password
          </TitleTypography>
          {!authTokenReceived && (
            <Grid item sm={12} md={10}>
              <TitleTypography variant="h4">
                First enter the six digit authorization code that was sent to
                your cell phone
              </TitleTypography>
            </Grid>
          )}
          {!authTokenReceived && (
            <Grid
              item
              sm={12}
              md={10}
              style={{
                marginTop: '1.5rem',
              }}
            >
              <AuthFieldHooks
                name="code"
                type="text"
                label="Authorization code"
                autoFocus
              />
            </Grid>
          )}
          <Grid
            item
            sm={12}
            md={10}
            style={{
              marginTop: '1.5rem',
            }}
          >
            <TitleTypography variant="h4">
              In order to protect your account, please make sure your password
              is 8 character minimum, includes at least one number and one
              capital letter
            </TitleTypography>
          </Grid>
          <Grid item sm={12} md={10}>
            <AuthFieldHooks
              name="password"
              type="password"
              label="Enter a new password"
            />
          </Grid>
          <Grid item sm={12} md={6}>
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
              Next
            </NextButton>
          </Grid>
        </Grid>
      </FormContext>
    </form>
  );
};

export default ResetPasswordForm;
