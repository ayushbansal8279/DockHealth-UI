import Grid from '@material-ui/core/Grid';
import React from 'react';
import { Field, reduxForm } from 'redux-form';

import AuthField from '../common/AuthField';
import { NextButton, TitleTypography } from './AuthComponents.styled';

const MIN_PASSWORD_LENGTH = 8;

const validate = values => {
  const errors = {};

  const { password } = values;

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = 'Password needs at least 8 characters';
  } else if (!password.match(/[0-9]/)) {
    errors.password = 'Password needs at least 1 number';
  } else if (!password.match(/[A-Z]/)) {
    errors.password = 'Password needs at least 1 capital letter';
  }

  return errors;
};

const ResetPasswordForm = props => {
  const { handleSubmit, invalid } = props;

  return (
    <form className="inline-label top-buffer" onSubmit={handleSubmit}>
      <TitleTypography variant="h2" style={{ marginTop: '3em' }}>
        Let’s set a new password
      </TitleTypography>
      <Grid item sm={12} md={9}>
        <TitleTypography variant="h4">
        First enter the six digit authorization code that was sent to your cell phone
        </TitleTypography>
      </Grid>
      <Grid item sm={12} md={9}>
        <Field
          marginTop="1.5rem"
          name="code"
          type="text"
          component={AuthField}
          label="Authorization code"
          autoFocus
        />
      </Grid>
      <Grid item sm={12} md={9}>
        <TitleTypography variant="h4">
          In order to protect your account, please make sure your password is 8
          character minimum, includes at least one number and one capital letter
        </TitleTypography>
      </Grid>
      <Grid item sm={12} md={9}>
        <Field
          marginTop="1.5rem"
          name="password"
          type="password"
          component={AuthField}
          label="New password"
        />
      </Grid>
      <Grid item xs={6}>
        <NextButton
          active={!invalid}
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
    </form>
  );
};

export default reduxForm({
  form: 'ResetPasswordForm',
  validate,
})(ResetPasswordForm);
