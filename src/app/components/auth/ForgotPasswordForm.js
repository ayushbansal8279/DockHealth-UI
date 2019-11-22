import Grid from '@material-ui/core/Grid';
import React from 'react';
import { Field, reduxForm } from 'redux-form';

import AuthField from '../common/AuthField';
import {
  HeightDependentGrid,
  NextButton,
  TitleTypography,
} from './AuthComponents.styled';

const validate = values => {
  const errors = {};

  if (!values.username) {
    errors.username = 'Please enter an email address';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i.test(values.username)
  ) {
    errors.username = 'Please enter a valid email address';
  }

  return errors;
};

const ForgotPasswordForm = props => {
  const { handleSubmit, invalid } = props;

  return (
    <form className="inline-label top-buffer" onSubmit={handleSubmit}>
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
          <Field
            marginTop="2.5rem"
            name="username"
            type="text"
            component={AuthField}
            label="Email"
            autoFocus
          />
        </HeightDependentGrid>

        <HeightDependentGrid size={9}>
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
            Send me a recovery code
          </NextButton>
        </HeightDependentGrid>
      </Grid>
    </form>
  );
};

export default reduxForm({
  form: 'ForgotPasswordForm',
  validate,
})(ForgotPasswordForm);
